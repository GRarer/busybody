import { Schemas } from '@nprindle/augustus';
import { CreateTaskRequest, FriendInfo, OwnTaskInfo, TodoListResponse, UpdateTaskRequest,
  WatchedTasksResponse } from 'busybody-core';
import { dbQuery, dbTransaction } from '../util/db.js';
import { UserException } from '../util/errors.js';
import { dontValidate, optionallyNullArrayOfSchema } from '../util/typeGuards.js';
import { lookupSessionUser } from './authentication.js';
import { currentFriendsQuery, databaseFriendInfoSchema } from './friends.js';
import pgFormat from 'pg-format';
import { v4 as uuidV4 } from 'uuid';
// TODO reduce duplication in this file

function currentTimeSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export async function getOwnTodoList(token: string): Promise<TodoListResponse> {
  const userUUID = await lookupSessionUser(token);
  const { friendRows, taskRows } = await dbTransaction(async query => {
    const friendRows = await query(
      currentFriendsQuery, [userUUID], databaseFriendInfoSchema
    );
    const taskRows = await query('select * from tasks_with_watcher_uuids where task_owner = $1', [userUUID],
      Schemas.recordOf({
        task_id: Schemas.aString,
        title: Schemas.aString,
        description_text: Schemas.aString,
        deadline_seconds: Schemas.aNumber,
        watcher_uuids: optionallyNullArrayOfSchema(Schemas.aString),
      })
    );
    return { friendRows, taskRows };
  });
  // munge rows into todo list response
  const friendsList: FriendInfo[] = [];
  const friendInfoMap = new Map<string, FriendInfo>();
  for (const friendRow of friendRows) {
    const info: FriendInfo = {
      uuid: friendRow.user_uuid,
      fullName: friendRow.full_name,
      username: friendRow.username
    };
    friendsList.push(info);
    friendInfoMap.set(info.uuid, info);
  }

  const tasksList: OwnTaskInfo[] = [];
  for (const taskRow of taskRows) {
    const watchers = taskRow.watcher_uuids.map(watcherUUID => friendInfoMap.get(watcherUUID))
      .filter((x: FriendInfo | undefined): x is FriendInfo => x !== undefined);
    tasksList.push({
      taskId: taskRow.task_id,
      title: taskRow.title,
      description: taskRow.description_text,
      dueDate: taskRow.deadline_seconds,
      watchers
    });
  }

  return {
    friends: friendsList,
    tasks: tasksList
  };
}

export async function getWatchedTasks(token: string): Promise<WatchedTasksResponse> {
  const watcherUUID = await lookupSessionUser(token);

  const rows = await dbQuery(
    `with watched_tasks as (
      select * from watch_assignments join tasks on watch_assignments.task = tasks.task_id where watcher = $1
    ) select task_id, task_owner, title, description_text, deadline_seconds, username, full_name
    from watched_tasks join users on watched_tasks.task_owner = users.user_uuid;`, [watcherUUID],
    Schemas.recordOf({
      task_id: Schemas.aString,
      task_owner: Schemas.aString,
      title: Schemas.aString,
      description_text: Schemas.aString,
      deadline_seconds: Schemas.aNumber,
      username: Schemas.aString,
      full_name: Schemas.aString
    }));
  return rows.map(row => ({
    taskId: row.task_id,
    title: row.title,
    description: row.description_text,
    dueDate: row.deadline_seconds,
    owner: {
      uuid: row.task_owner,
      username: row.username,
      fullName: row.full_name
    }
  }));
}

export async function updateTask(request: UpdateTaskRequest, token: string): Promise<void> {
  const userUUID = await lookupSessionUser(token);
  await dbTransaction(async query => {
    // verify task exists and is owned by this user
    const matches = await query(
      'select * from tasks where task_id = $1 and task_owner = $2',
      [request.taskId, userUUID], dontValidate
    );
    if (matches.length !== 1) {
      throw new UserException(404, 'failed to update because specified task does not exist or does not belong to you');
    }

    // exclude watchers who aren't this user's friend
    // (this situation could occur nonmaliciously if a user is unfriended while editing a task)
    const allFriendUUIDs = new Set((
      await dbQuery(currentFriendsQuery, [userUUID], databaseFriendInfoSchema)
    ).map(row => row.user_uuid));
    request.watcherUUIDs = request.watcherUUIDs.filter(w => allFriendUUIDs.has(w));

    // TODO reset notifications_sent if new deadline is in the future

    // update task data
    if (request.dueDate > currentTimeSeconds()) {
      await query(
        `update tasks set title = $1, description_text = $2, deadline_seconds = $3, notification_sent = FALSE
        where task_id = $4`,
        [request.title, request.description, request.dueDate, request.taskId], dontValidate
      );
    } else {
      await query(
        'update tasks set title = $1, description_text = $2, deadline_seconds = $3 where task_id = $4',
        [request.title, request.description, request.dueDate, request.taskId], dontValidate
      );
    }



    // update watchers
    await query('delete from watch_assignments where task = $1', [request.taskId], dontValidate);
    const watch_assignments = request.watcherUUIDs.map(watcherUUID => [request.taskId, watcherUUID]);
    if (watch_assignments.length > 0) {
      const insertion = pgFormat('insert into watch_assignments (task, watcher) VALUES  %L;', watch_assignments);
      await query(insertion, [], dontValidate);
    }
  });
}

export async function createTask(request: CreateTaskRequest, token: string): Promise<void> {
  const userUUID = await lookupSessionUser(token);
  const taskId = uuidV4();

  await dbTransaction(async query => {
    await query(
      `insert into tasks ("task_id", "task_owner", "title", "description_text", "deadline_seconds")
      VALUES ($1, $2, $3, $4, $5);`, [taskId, userUUID, request.title, request.description, request.dueDate],
      dontValidate
    );

    // exclude watchers are not user's friends
    const allFriendUUIDs = new Set((
      await dbQuery(currentFriendsQuery, [userUUID], databaseFriendInfoSchema)
    ).map(row => row.user_uuid));
    request.watcherUUIDs = request.watcherUUIDs.filter(w => allFriendUUIDs.has(w));

    // insert watchers
    const watch_assignments = request.watcherUUIDs.map(watcherUUID => [taskId, watcherUUID]);
    if (watch_assignments.length > 0) {
      const insertion = pgFormat('insert into watch_assignments (task, watcher) VALUES  %L;', watch_assignments);
      await query(insertion, [], dontValidate);
    }
  });
}

export async function unfollowTask(taskId: string, token: string): Promise<void> {
  const userUUID = await lookupSessionUser(token);
  await dbQuery('delete from watch_assignments where task = $1 and watcher = $2;', [taskId, userUUID], dontValidate);
}

export async function deleteTask(taskId: string, token: string): Promise<void> {
  const userUUID = await lookupSessionUser(token);
  await dbQuery('delete from tasks where task_id = $1 and task_owner = $2;', [taskId, userUUID], dontValidate);
}
