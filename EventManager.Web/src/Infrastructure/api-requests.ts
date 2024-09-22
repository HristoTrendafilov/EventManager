import type { UserNewDto } from '~User/Register/Register';

import { callApi } from './api-client';
import type {
  EventDto,
  LogoutUserDto,
  RegionDto,
  UserDto,
  UserLoginDto,
  UserLoginResponseDto,
} from './api-types';

export function loginUser(req: UserLoginDto) {
  return callApi<UserLoginResponseDto>(
    '/users/login',
    'POST',
    JSON.stringify(req)
  );
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
