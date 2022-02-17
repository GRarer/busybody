import { DomainOf, Schemas } from "@nprindle/augustus";
import { GetEndpoint, PutEndpoint } from "..";

export const registrationRequestSchema = Schemas.recordOf({
  username: Schemas.aString,
  password: Schemas.aString,
  fullName: Schemas.aString,
  nickname: Schemas.aString,
  email: Schemas.aString,
});

export type RegistrationRequest = DomainOf<typeof registrationRequestSchema>;

export const RegistrationEndpoint: PutEndpoint<RegistrationRequest, {}, string> = {
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
