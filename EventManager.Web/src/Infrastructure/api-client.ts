import toast from 'react-hot-toast';

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
  | { data: T; success: true; statusCode: number; headers: Headers }
  | {
      success: false;
      errorMessage: string;
      validationPropertyErrors: ValidationPropertyError[];
      hasValidationErrors: boolean;
      statusCode: number;
      headers: Headers;
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
      errorMessage: 'Мрежова грешка. Моля, опитайте по-късно.',
    } as ApiResponse<T>;
  }

  const { navigate } = state.navigation;

  const { status } = fetchResponse;
  if (status === 502) {
    return {
      success: false,
      errorMessage:
        'Не може да се осъществи връзка към сървъра. Моля, опитайте по-късно.',
    } as ApiResponse<T>;
  }

  if (status === 401 || status === 403) {
    toast.error('Нямате право на достъп до този ресурс.');

    if (navigate) {
      navigate('/');
    }

    return {} as ApiResponse<T>;
  }

  if (status === 404) {
    if (navigate) {
      navigate('/not-found');
    }
  }

  const tokenExpired = fetchResponse.headers.get('TokenExpired');
  if (tokenExpired) {
    store.dispatch(removeUser());

    if (endPoint !== '/users/logout') {
      toast.error('Сесията ви изтече. Моля, влезте отново в профила си.');
    }

    if (navigate) {
      navigate('/');
    }

    return {} as ApiResponse<T>;
  }

  const contentType = fetchResponse.headers.get('Content-Type');

  try {
    if (contentType === 'application/octet-stream') {
      // If the content type is application/octet-stream, return Blob as the data property
      const blobData = await fetchResponse.blob();
      return {
        data: blobData as unknown as T, // Cast Blob to T, assuming the caller knows T is Blob
        success: true,
        statusCode: fetchResponse.status,
        headers: fetchResponse.headers,
      } as ApiResponse<T>;
    }

    // Otherwise, handle JSON response
    const jsonData = (await fetchResponse.json()) as ApiResponse<T>;
    jsonData.statusCode = fetchResponse.status;
    jsonData.headers = fetchResponse.headers;
    return jsonData;
  } catch (err) {
    reportError(err);
    return {
      success: false,
      errorMessage: 'Грешка при четене на данни от сървъра.',
    } as ApiResponse<T>;
  }
}
