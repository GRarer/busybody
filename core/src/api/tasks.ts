import { DomainOf, Schemas } from '@nprindle/augustus';
import { DeleteEndpoint, GetEndpointSimple, PostEndpointSimple, PutEndpointSimple } from '../apis.js';
import { FriendInfo, friendInfoSchema } from './friends.js';

type BasicTaskInfo = {
  taskId: string;
  title: string;
  description: string;
  dueDate: number; // represented in seconds since epoch
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

export const getTodoListEndpoint = new GetEndpointSimple('/todo', Schemas.recordOf({
  tasks: Schemas.arrayOf(Schemas.recordOf({
    taskId: Schemas.aString,
    title: Schemas.aString,
    description: Schemas.aString,
    dueDate: Schemas.aNumber,
    watchers: Schemas.arrayOf(friendInfoSchema)
  })),
  friends: Schemas.arrayOf(friendInfoSchema)
}));

export const watchedTasksResponseSchema = Schemas.arrayOf(Schemas.recordOf({
  taskId: Schemas.aString,
  title: Schemas.aString,
  description: Schemas.aString,
  dueDate: Schemas.aNumber,
  owner: friendInfoSchema
}));

export type WatchedTasksResponse = DomainOf<typeof watchedTasksResponseSchema>;

export const getWatchedTasksEndpoint = new GetEndpointSimple('/watched', Schemas.arrayOf(Schemas.recordOf({
  taskId: Schemas.aString,
  title: Schemas.aString,
  description: Schemas.aString,
  dueDate: Schemas.aNumber,
  owner: friendInfoSchema
})));

export type UpdateTaskRequest = BasicTaskInfo & {
  watcherUUIDs: string[];
};

export type CreateTaskRequest = {
  title: BasicTaskInfo['title'];
  description: BasicTaskInfo['description'];
  dueDate: BasicTaskInfo['dueDate'];
  watcherUUIDs: string[];
};

export const updateTaskEndpoint = new PutEndpointSimple('/update_task', {
  requestSchema: Schemas.recordOf({
    taskId: Schemas.aString,
    title: Schemas.aString,
    description: Schemas.aString,
    dueDate: Schemas.aNumber,
    watcherUUIDs: Schemas.arrayOf(Schemas.aString)
  }),
  responseSchema: getTodoListEndpoint.responseSchema
});

export const createTaskEndpoint = new PostEndpointSimple('/new_task', {
  requestSchema: Schemas.recordOf({
    title: Schemas.aString,
    description: Schemas.aString,
    dueDate: Schemas.aNumber,
    watcherUUIDs: Schemas.arrayOf(Schemas.aString)
  }),
  responseSchema: getTodoListEndpoint.responseSchema
});

export const unfollowTaskEndpoint = new DeleteEndpoint('/unfollow_task', {
  querySchema: Schemas.recordOf({ task_id: Schemas.aString }),
  responseSchema: getWatchedTasksEndpoint.responseSchema
});

export const deleteTaskEndpoint = new DeleteEndpoint('/delete_task', {
  querySchema: Schemas.recordOf({ task_id: Schemas.aString }),
  responseSchema: getTodoListEndpoint.responseSchema
});

