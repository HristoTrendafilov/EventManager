import { reportError } from './utils';

const apiBaseUrl = '/api';
const apiWaitTimeout = 5000;

async function extractApiMessage(apiResponse: Response) {
  const apiMessage = await apiResponse.text();
  if (apiMessage) {
    throw new Error(apiMessage);
  }

  const { status } = apiResponse;

  if (status >= 500) {
    throw new Error('Грешка на сървъра. Моля, опитайте по-късно.');
  } else if (status === 400) {
    throw new Error('Грешка в заявката към сървъра.');
  } else if (status === 401 || status === 403) {
    throw new Error('Нямате права за достъпване на този ресурс.');
  } else if (status === 404) {
    throw new Error('Ресурсът, който търсите, не може да бъде намерен.');
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
    throw new Error(`Мрежови проблем. Mоля опитайте по-късно.`);
  }

  if (!apiResponse.ok) {
    await extractApiMessage(apiResponse);
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
