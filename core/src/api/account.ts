import { DomainOf, Schemas } from '@nprindle/augustus';
import { DeleteEndpointSimple, GetEndpointSimple, PutEndpointSimple } from '../apis.js';
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
  responseSchema: Schemas.aString
});

export type SelfInfoResponse = {
  username: string;
  fullName: string;
  nickname: string;
  email: string;
};

export const selfInfoEndpoint = new GetEndpointSimple('/self',
  Schemas.recordOf({
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString,
    email: Schemas.aString,
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

export const updateEmailEndpoint = new PutEndpointSimple('/update_email_address', {
  requestSchema: Schemas.aString,
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
  // TODO include any other account settings
});

export type ExportedPersonalData = DomainOf<typeof exportedPersonalDataSchema>;

export const exportPersonalDataEndpoint = new GetEndpointSimple('/export_data', exportedPersonalDataSchema);

export const deleteAccountEndpoint = new DeleteEndpointSimple('/delete_account', Schemas.aNull);
