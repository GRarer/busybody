import { Schemas } from '@nprindle/augustus';
import { DeleteEndpoint, GetEndpoint, PutEndpoint } from '../apis.js';
import { FriendInfo, friendInfoSchema } from './friends.js';

type BasicTaskInfo = {
  taskId: string;
  title: string;
  description: string;
  // TODO choose best timezone-agnostic serialization format for date-time; unix time seconds may not be best
  dueDate: number; // represented in seconds since epoch
  overdue: boolean;
};

export type OwnTaskInfo = BasicTaskInfo & {
  watchers: FriendInfo[];
};

export type TodoListResponse = {
  tasks: OwnTaskInfo[];
  // friends list is used to populate 'add watcher' UI
  friends: FriendInfo[];
};

export type WatchedTaskInfo = BasicTaskInfo & {
  owner: FriendInfo;
};

export const getTodoListEndpoint: GetEndpoint<{}, TodoListResponse> = {
  method: 'get',
  relativePath: '/todo',
  requestValidator: Schemas.anUndefined.validate,
  queryValidator: Schemas.recordOf({}).validate,
  responseValidator: Schemas.recordOf({
    tasks: Schemas.arrayOf(Schemas.recordOf({
      taskId: Schemas.aString,
      title: Schemas.aString,
      description: Schemas.aString,
      dueDate: Schemas.aNumber,
      overdue: Schemas.aBoolean,
      watchers: Schemas.arrayOf(friendInfoSchema)
    })),
    friends: Schemas.arrayOf(friendInfoSchema)
  }).validate
};

export const getWatchedTasksEndpoint: GetEndpoint<{}, WatchedTaskInfo[]> = {
  method: 'get',
  relativePath: '/watched',
  requestValidator: Schemas.anUndefined.validate,
  queryValidator: Schemas.recordOf({}).validate,
  responseValidator: Schemas.arrayOf(Schemas.recordOf({
    taskId: Schemas.aString,
    title: Schemas.aString,
    description: Schemas.aString,
    dueDate: Schemas.aNumber,
    overdue: Schemas.aBoolean,
    owner: friendInfoSchema
  })).validate
};

export type UpdateTaskRequest = BasicTaskInfo & {
  watcherUUIDs: string[];
};

export type CreateTaskRequest = {
  title: BasicTaskInfo['title'];
  description: BasicTaskInfo['description'];
  dueDate: BasicTaskInfo['dueDate'];
  watcherUUIDs: string[];
};

export const updateTaskEndpoint: PutEndpoint<UpdateTaskRequest, {}, null> = {
  method: 'put',
  relativePath: '/update_task',
  requestValidator: Schemas.recordOf({
    taskId: Schemas.aString,
    title: Schemas.aString,
    description: Schemas.aString,
    dueDate: Schemas.aNumber,
    overdue: Schemas.aBoolean,
    watcherUUIDs: Schemas.arrayOf(Schemas.aString)
  }).validate,
  queryValidator: Schemas.recordOf({}).validate,
  responseValidator: Schemas.aNull.validate
};

export const createTaskEndpoint: PutEndpoint<CreateTaskRequest, {}, null> = {
  method: 'put',
  relativePath: '/new_task',
  requestValidator: Schemas.recordOf({
    title: Schemas.aString,
    description: Schemas.aString,
    dueDate: Schemas.aNumber,
    overdue: Schemas.aBoolean,
    watcherUUIDs: Schemas.arrayOf(Schemas.aString)
  }).validate,
  queryValidator: Schemas.recordOf({}).validate,
  responseValidator: Schemas.aNull.validate
};

export const unfollowTaskEndpoint: DeleteEndpoint<{task_id: string;}, WatchedTaskInfo[]> = {
  method: 'delete',
  relativePath: '/unfollow_task',
  requestValidator: Schemas.anUndefined.validate,
  queryValidator: Schemas.recordOf({
    task_id: Schemas.aString
  }).validate,
  responseValidator: getWatchedTasksEndpoint.responseValidator
};
