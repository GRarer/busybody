import { Json } from '@nprindle/augustus';
import { answerRequestEndpoint, deleteAccountEndpoint, Endpoint, exportPersonalDataEndpoint, getFriendsListEndpoint,
  loginEndpoint, logoutEndpoint, registrationEndpoint, selfInfoEndpoint, sendFriendRequestEndpoint,
  serverStatusEndpoint, sessionActiveEndpoint, unfriendEndpoint, updateEmailEndpoint, updatePasswordEndpoint,
  updatePersonalInfoEndpoint, cancelFriendRequestEndpoint, getTodoListEndpoint, getWatchedTasksEndpoint,
  updateTaskEndpoint, createTaskEndpoint, unfollowTaskEndpoint, deleteTaskEndpoint,
  testEmailEndpoint, toggleGravatarEndpoint, serverOnlineEndpoint, resetPasswordRequestEndpoint, resetPasswordEndpoint,
  requestEmailUpdateCodeEndpoint,
  verifyRegistrationEndpoint} from 'busybody-core';
import { FastifyInstance } from 'fastify';
import { completeRegistration, deleteAccount, exportAccountData, getSelfInfo, sendEmailVerificationCode, startRegistration, updateAccountInfo,
  updateEmailAddress, updateGravatarSetting, updatePassword } from './services/accountInfo.js';
import { getServerStatus, sendTestEmail } from './services/admin.js';
import { isValidSession, logIn, logOut } from './services/authentication.js';
import { answerFriendRequest, cancelFriendRequest, getUserFriendsList, sendFriendRequest,
  unfriend } from './services/friends.js';
import { requestPasswordReset, resetPassword } from './services/passwordReset.js';
import { createTask, deleteTask, getOwnTodoList, getWatchedTasks, unfollowTask, updateTask } from './services/tasks.js';
import { serverConfiguration } from './util/config.js';
import { attachHandlerWithSafeWrapper } from './util/endpointWrapper.js';

type JsonValue = Json.JsonValue;

// associates handlers with API endpoints and wraps them to provide consistent type-safety of API boundary

export function attachHandlers(server: FastifyInstance): void {
  const addHandler = <
    Request, Query, Response,
    ReqRepr extends JsonValue | undefined, QRepr extends Record<string, string>, ResRepr extends JsonValue
  >(
    e: Endpoint<Request, Query, Response, ReqRepr, QRepr, ResRepr>,
    h: (requestBody: Request, queryParams: Query, token: string) => Promise<Response>
  ): void => attachHandlerWithSafeWrapper(server, e, h);

  // all API endpoint handlers are attached here

  // server admin and testing
  if (serverConfiguration.testingCommandsEnabled) {
    addHandler(serverStatusEndpoint, getServerStatus);
    addHandler(testEmailEndpoint, async (request, query, token) => {
      await sendTestEmail(request);
      return null;
    });
  }

  addHandler(serverOnlineEndpoint, async () => { return true; });

  // authentication
  addHandler(loginEndpoint, logIn);
  addHandler(logoutEndpoint, async (body, params, token) => {
    await logOut(token);
    console.log('logged out');
    return null;
  });
  addHandler(sessionActiveEndpoint, async (body, params, token) => isValidSession(token));

  // account registration
  addHandler(registrationEndpoint, async body => {
    await startRegistration(body);
    return null
  });
  addHandler(verifyRegistrationEndpoint, async (body) => {
    return ({token: await completeRegistration(body.userUUID, body.verificationCode)});
  })

  // user accounts and settings
  addHandler(selfInfoEndpoint, async (body, params, token) => {
    return await getSelfInfo(token);
  });
  addHandler(updatePersonalInfoEndpoint, async (body, params, token) => {
    await updateAccountInfo(body, token);
    return null;
  });
  addHandler(requestEmailUpdateCodeEndpoint, async body => {
    await sendEmailVerificationCode(body.newEmail);
    return null;
  });
  addHandler(updateEmailEndpoint, async (body, params, token) => {
    await updateEmailAddress(body.newEmail, body.verificationCode, token);
    return null;
  });
  addHandler(updatePasswordEndpoint, async (body, params, token) => {
    await updatePassword(body, token);
    return null;
  });
  addHandler(toggleGravatarEndpoint, async (body, params, token) => {
    await updateGravatarSetting(body, token);
    return null;
  });
  addHandler(exportPersonalDataEndpoint, async (body, params, token) => {
    return await exportAccountData(token);
  });
  addHandler(deleteAccountEndpoint, async (body, params, token) => {
    await deleteAccount(token);
    return null;
  });

  // password reset
  addHandler(resetPasswordRequestEndpoint, async (body, params, token) => {
    await requestPasswordReset(body.email);
    return null;
  });
  addHandler(resetPasswordEndpoint, async (body, params, token) => {
    return await resetPassword(body);
  });

  // friends lists
  addHandler(getFriendsListEndpoint, async (body, params, token) => {
    return await getUserFriendsList(token);
  });
  addHandler(sendFriendRequestEndpoint, async (body, params, token) => {
    await sendFriendRequest(token, body);
    return await getUserFriendsList(token);
  });
  addHandler(answerRequestEndpoint, async (body, params, token) => {
    await answerFriendRequest(token, body);
    return await getUserFriendsList(token);
  });
  addHandler(unfriendEndpoint, async (body, params, token) => {
    await unfriend(token, body.uuid);
    return await getUserFriendsList(token);
  });
  addHandler(cancelFriendRequestEndpoint, async (body, params, token) => {
    await cancelFriendRequest(token, body.uuid);
    return await getUserFriendsList(token);
  });

  // tasks
  addHandler(getTodoListEndpoint, async (body, params, token) => {
    return await getOwnTodoList(token);
  });
  addHandler(getWatchedTasksEndpoint, async (body, params, token) => {
    return await getWatchedTasks(token);
  });
  addHandler(updateTaskEndpoint, async (body, params, token) => {
    await updateTask(body, token);
    return await getOwnTodoList(token);
  });
  addHandler(createTaskEndpoint, async (body, params, token) => {
    await createTask(body, token);
    return await getOwnTodoList(token);
  });
  addHandler(unfollowTaskEndpoint, async (body, params, token) => {
    await unfollowTask(params.task_id, token);
    return await getWatchedTasks(token);
  });
  addHandler(deleteTaskEndpoint, async (body, params, token) => {
    await deleteTask(params.task_id, token);
    return await getOwnTodoList(token);
  });
}
