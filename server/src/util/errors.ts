export class UserException extends Error {
  constructor(
    public readonly statusCode: 400 | 401 | 403 | 404 | 409 | 500,
    msg: string = 'something went wrong'
  ) {
    super(msg);
  }
}
