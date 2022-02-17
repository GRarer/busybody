import { DomainOf, Schemas } from '@nprindle/augustus';
import { DeleteEndpoint, GetEndpoint, PutEndpoint } from '..';

export const registrationRequestSchema = Schemas.recordOf({
  username: Schemas.aString,
  password: Schemas.aString,
  fullName: Schemas.aString,
  nickname: Schemas.aString,
  email: Schemas.aString,
});

export type RegistrationRequest = DomainOf<typeof registrationRequestSchema>;

export const registrationEndpoint: PutEndpoint<RegistrationRequest, {}, string> = {
  method: 'put',
  relativePath: '/register',
  requestValidator: registrationRequestSchema.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aString.validate
};

export type SelfInfoResponse = {
  username: string;
  fullName: string;
  nickname: string;
  email: string;
};

export const selfInfoEndpoint: GetEndpoint<{}, SelfInfoResponse> = {
  method: 'get',
  relativePath: '/self',
  requestValidator: Schemas.anUndefined.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.recordOf({
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString,
    email: Schemas.aString,
  }).validate
};

export const updatePersonalInfoEndpoint: PutEndpoint<{
  username: string; fullName: string; nickname: string;
}, {}, null> = {
  method: 'put',
  relativePath: '/update_personal_info',
  requestValidator: Schemas.recordOf({
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString
  }).validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aNull.validate
};

export const updateEmailEndpoint: PutEndpoint<string, {}, null> = {
  method: 'put',
  relativePath: '/update_email_address',
  requestValidator: Schemas.aString.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aNull.validate
};

export const updatePasswordEndpoint: PutEndpoint<string, {}, null> = {
  method: 'put',
  relativePath: '/update_password',
  requestValidator: Schemas.aString.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aNull.validate
};

const exportedPersonalDataSchema = Schemas.recordOf({
  description: Schemas.aString,
  dateExported: Schemas.aString,
  personalInfo: Schemas.recordOf({
    username: Schemas.aString,
    fullName: Schemas.aString,
    nickname: Schemas.aString,
    email: Schemas.aString,
  }),
  // TODO include friends list
  // TODO include tasks
  // TODO include watched tasks
  // TODO include any other account settings
});

export type ExportedPersonalData = DomainOf<typeof exportedPersonalDataSchema>;

export const exportPersonalDataEndpoint: GetEndpoint<{}, ExportedPersonalData> = {
  method: 'get',
  relativePath: '/export_data',
  requestValidator: Schemas.anUndefined.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: exportedPersonalDataSchema.validate,
};

export const deleteAccountEndpoint: DeleteEndpoint<{}, null> = {
  method: 'delete',
  relativePath: '/delete_account',
  requestValidator: Schemas.anUndefined.validate,
  querySchema: Schemas.recordOf({}),
  responseValidator: Schemas.aNull.validate,
};
