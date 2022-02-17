import { DomainOf, Schemas } from '@nprindle/augustus';
import { GetEndpoint, PutEndpoint } from '..';

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
