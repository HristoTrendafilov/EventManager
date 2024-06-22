import { reportError } from './utils';

const apiBaseUrl = '/api';
const apiWaitTimeout = 5000;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export async function callApi<T>(
  endPoint: string,
  method: HttpMethod,
  body?: string
): Promise<T> {
  const fetchOptions: RequestInit = {
    method,
    body,
    signal: AbortSignal.timeout(apiWaitTimeout),
  };

  // Set it to the window variable
  // TODO: Get the token form redux state
  // const state = store.getState();
  // if (state.user.token) {
  //   fetchOptions.headers = {
  //     ...fetchOptions.headers,
  //     Authorization: `Bearer ${state.user.token}`,
  //   };
  // }

  if (body) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  let apiResponse: Response;
  try {
    apiResponse = await fetch(`${apiBaseUrl}${endPoint}`, fetchOptions);
  } catch (err) {
    reportError(err);
    throw new Error(`Мрежови проблем. Mоля опитайте по-късно.`);
  }

  if (!apiResponse.ok) {
    if (apiResponse.status === 502) {
      throw new Error('Грешка при свързване към сървъра.');
    }

    throw new Error(await apiResponse.text());
  }

  if (apiResponse.status === 204) {
    return {} as T;
  }

  try {
    return (await apiResponse.json()) as T;
  } catch (err) {
    reportError(err);
    throw new Error(`Възникна грешка при четенето на резултат от сървъра.`);
  }
}
