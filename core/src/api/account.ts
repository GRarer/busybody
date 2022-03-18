import { DomainOf, Schemas } from '@nprindle/augustus';
import { DeleteEndpointSimple, GetEndpointSimple, PostEndpointSimple, PutEndpointSimple } from '../apis.js';
import { friendInfoSchema } from './friends.js';
import { ownTaskInfoSchema, watchedTasksResponseSchema } from './tasks.js';

export const registrationRequestSchema = Schemas.recordOf({
  username: Schemas.aString,
  password: Schemas.aString,
  fullName: Schemas.aString,
  nickname: Schemas.aString,
  email: Schemas.aString,
});

export type RegistrationRequest = DomainOf<typeof registrationRequestSchema>;

export const registrationEndpoint = new PutEndpointSimple('/register', {
  requestSchema: registrationRequestSchema,
  responseSchema: Schemas.aNull
});

export const verifyRegistrationEndpoint = new PutEndpointSimple('/verify_registration', {
  requestSchema: Schemas.recordOf({
    userUUID: Schemas.aString,
    verificationCode: Schemas.aString
  }),
  responseSchema: Schemas.recordOf({ token: Schemas.aString }),
});

export type SelfInfoResponse = {
  uuid: string;
  username: string;
  fullName: string;
  nickname: string;
  email: string;
  useGravatar: boolean;
};

export const selfInfoEndpoint = new GetEndpointSimple('/self',
  Schemas.recordOf({
    uuid: Schemas.aString,
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString,
    email: Schemas.aString,
    useGravatar: Schemas.aBoolean
  })
);

export const updatePersonalInfoEndpoint = new PutEndpointSimple('/update_personal_info', {
  requestSchema: Schemas.recordOf({
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString
  }),
  responseSchema: Schemas.aNull
});

export const requestEmailUpdateCodeEndpoint = new PostEndpointSimple('/request_email_update_code', {
  requestSchema: Schemas.recordOf({
    newEmail: Schemas.aString
  }),
  responseSchema: Schemas.aNull
});

export const updateEmailEndpoint = new PutEndpointSimple('/update_email_address', {
  requestSchema: Schemas.recordOf({
    newEmail: Schemas.aString,
    verificationCode: Schemas.aString
  }),
  responseSchema: Schemas.aNull
});

export const toggleGravatarEndpoint = new PutEndpointSimple('/set_gravatar_enabled', {
  requestSchema: Schemas.aBoolean,
  responseSchema: Schemas.aNull
});

export const updatePasswordEndpoint = new PutEndpointSimple('/update_password', {
  requestSchema: Schemas.aString,
  responseSchema: Schemas.aNull
});

const exportedPersonalDataSchema = Schemas.recordOf({
  description: Schemas.aString,
  dateExported: Schemas.aString,
  personalInfo: Schemas.recordOf({
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString,
    email: Schemas.aString,
  }),
  todoListTasks: Schemas.arrayOf(ownTaskInfoSchema),
  friends: Schemas.arrayOf(friendInfoSchema),
  watchedTasks: watchedTasksResponseSchema,
});

export type ExportedPersonalData = DomainOf<typeof exportedPersonalDataSchema>;

export const exportPersonalDataEndpoint = new GetEndpointSimple('/export_data', exportedPersonalDataSchema);

export const deleteAccountEndpoint = new DeleteEndpointSimple('/delete_account', Schemas.aNull);
