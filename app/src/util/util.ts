export function errorToMessage(error: unknown): {code: number; message: string;} {
  const data = (
    error as { response?: { data?: {statusCode?: unknown; message?: unknown; };};}
  ).response?.data;
  if (data === undefined) {
    console.error('unexpected error type:');
    console.log(error);
  }

  const code = typeof data?.statusCode === 'number' ? data.statusCode : 500;
  const message = (typeof data?.message === 'string' && data.message !== '') ? data.message : 'Something went wrong';
  return { code, message };
}
