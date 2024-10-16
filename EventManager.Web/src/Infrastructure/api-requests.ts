import type { UserLogin } from '~User/Login/Login';
import type { NewUser } from '~User/Register/Register';

import { callApi } from './api-client';
import type {
  EventDto,
  FileObject,
  RegionDto,
  UserDto,
  UserLoginResponseDto,
} from './api-types';

export function loginUser(req: UserLogin) {
  return callApi<UserLoginResponseDto>(
    '/users/login',
    'POST',
    JSON.stringify(req)
  );
}

export function registerUser(req: NewUser) {
  return callApi<UserDto>('/users', 'POST', JSON.stringify(req));
}

export function logoutUser() {
  return callApi('/users/logout', 'POST');
}

export function getRegions() {
  return callApi<RegionDto[]>('/regions', 'GET');
}

export function getEvent(eventId: number) {
  return callApi<EventDto>(`/events/${eventId}`, 'GET');
}

export function createEvent(event: FormData) {
  return callApi<EventDto>(`/events`, 'POST', event);
}

export function updateEvent(eventId: number, event: FormData) {
  return callApi<EventDto>(`/events/${eventId}`, 'PUT', event);
}

export function getEventMainImage(eventId: number) {
  return callApi<FileObject>(`/events/${eventId}/main-image`, 'GET');
}
