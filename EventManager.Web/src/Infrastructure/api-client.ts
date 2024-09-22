import { reportError } from './utils';

const apiBaseUrl = '/api';
const apiWaitTimeout = 5000;

async function handleApiError(apiResponse: Response) {
  const apiMessage = await apiResponse.text();
  const { status } = apiResponse;

  if (apiMessage) {
    throw new Error(apiMessage);
  }

  switch (status) {
    case 500:
      throw new Error('Server error. Please try again later.');
    case 400:
      throw new Error('Bad request to the server.');
    case 401:
    case 403:
      throw new Error('You do not have permission to access this resource.');
    case 404:
      throw new Error('The resource you are looking for could not be found.');
    case 422:
      throw new Error('There was an error with the data sent to the server.');
    default:
      throw new Error(`Unexpected error: ${status}`);
  }
}

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

  const { userToken } = window;
  if (userToken) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${userToken}`,
    };
  }

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
    throw new Error(`Network error. Please try again later.`);
  }

  if (!apiResponse.ok) {
    await handleApiError(apiResponse);
  }

  if (apiResponse.status === 204) {
    return {} as T;
  }

  try {
    return (await apiResponse.json()) as T;
  } catch (err) {
    reportError(err);
    throw new Error(`Error while reading data from the server.`);
  }
}
