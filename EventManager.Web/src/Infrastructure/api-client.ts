import { store } from './redux/store';
import { removeUser } from './redux/user-slice';
import { reportError } from './utils';

const apiBaseUrl = '/api';
const apiWaitTimeout = 5000;

export interface ValidationPropertyError {
  propertyName: string;
  errorMessage: string;
}

type ApiResponse<T = undefined> =
  | { data: T; success: true }
  | {
      success: false;
      errorMessage: string;
      validationPropertyErrors: ValidationPropertyError[];
      hasValidationErrors: boolean;
    };

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export async function callApi<T>(
  endPoint: string,
  method: HttpMethod,
  body?: string | FormData
): Promise<ApiResponse<T>> {
  const fetchOptions: RequestInit = {
    method,
    body,
    signal: AbortSignal.timeout(apiWaitTimeout),
  };

  const state = store.getState();

  if (state.user.token) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${state.user.token}`,
    };
  }

  if (body && typeof body === 'string') {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  let fetchResponse: Response;
  try {
    fetchResponse = await fetch(`${apiBaseUrl}${endPoint}`, fetchOptions);
  } catch (err) {
    reportError(err);

    return {
      success: false,
      errorMessage: 'Network error. Please try again later.',
    } as ApiResponse<T>;
  }

  const tokenExpired = fetchResponse.headers.get('TokenExpired');
  if (tokenExpired) {
    store.dispatch(removeUser());
    window.location.href = '/';

    return {
      success: false,
      errorMessage: 'Session expired. Please log in again.',
    } as ApiResponse<T>;
  }

  let jsonData: ApiResponse<T>;
  try {
    jsonData = (await fetchResponse.json()) as ApiResponse<T>;
  } catch (err) {
    reportError(err);
    return {
      success: false,
      errorMessage: 'Error while reading data from the server.',
    } as ApiResponse<T>;
  }

  return jsonData;
}
