// TODO automatic handling to send error codes
export class UserException extends Error {
  constructor(public readonly code: number, msg: string = 'something went wrong') {
    super(msg);
  }
}
