import type {
  EventDto,
  LogoutUserDto,
  RegionDto,
  UserDto,
} from '~Infrastructure/api-types';
import { store } from '~Infrastructure/redux/store';
import type { UserLoginDto } from '~User/Login/Login';
import type { UserNewDto } from '~User/Register/Register';

import type { UserState } from './redux/user-slice';
import { reportError } from './utils';

const apiBaseUrl = '/api';
const apiWaitTimeout = 5000;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
async function callApi<T>(
  endPoint: string,
  method: HttpMethod,
  body?: string
): Promise<T> {
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

  if (method !== 'GET') {
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

export function loginUser(req: UserLoginDto) {
  return callApi<UserState>('/users/login', 'POST', JSON.stringify(req));
}

export function registerUser(req: UserNewDto) {
  return callApi<UserDto>('/users', 'POST', JSON.stringify(req));
}

export function logoutUser(req: LogoutUserDto) {
  return callApi('/users/logout', 'POST', JSON.stringify(req));
}

export function getRegions() {
  return callApi<RegionDto[]>('/regions', 'GET');
}

export function getEvent(eventId: number) {
  return callApi<EventDto>(`/events/${eventId}`, 'GET');
}

export function createEvent(eventId: number) {
  return callApi<EventDto>(`/events/${eventId}`, 'POST');
}

export function updateEvent(eventId: number) {
  return callApi<EventDto>(`/events/${eventId}`, 'PUT');
}
