import { callApi } from './api-client';
import type {
  EventDto,
  LogoutUserDto,
  RegionDto,
  UserDto,
  UserLoginDto,
  UserLoginResponseDto,
  UserNewDto,
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

export function createEvent(event: FormData) {
  return callApi<EventDto>(`/events`, 'POST', event);
}

export function updateEvent(eventId: number, event: FormData) {
  return callApi<EventDto>(`/events/${eventId}`, 'PUT', event);
}

export function getEventMainImage(eventId: number) {
  return callApi<Blob>(`/events/${eventId}/main-image`, 'GET', undefined, true);
}
