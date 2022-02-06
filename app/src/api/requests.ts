import axios from "axios";

const API_BASE_URL = "http://localhost:3001/";

let sessionToken: string | undefined = undefined;

function getTokenHeader(): {} | {token: string}  {
  if (sessionToken === undefined) {
    return {}
  } else {
    return {token: sessionToken}
  }
}


export async function apiGet<Response>(path: string,): Promise<Response> {
  const result = await axios.get(API_BASE_URL + path, {
    headers: getTokenHeader()
  });
  // TODO validate response type
  return result.data;
}
