import type { UserLogin } from '~User/Login/Login';
import type { UserUpdatePersonalData } from '~User/Update/UserUpdate';

import { callApi } from './api-client';
import type {
  EventDto,
  RegionView,
  UserLoginResponseDto,
  UserView,
} from './api-types';

export function loginUser(req: UserLogin) {
  return callApi<UserLoginResponseDto>(
    '/users/login',
    'POST',
    JSON.stringify(req)
  );
}

export function registerUser(user: FormData) {
  return callApi('/users', 'POST', user);
}

export function logoutUser() {
  return callApi('/users/logout', 'POST');
}

export function getRegions() {
  return callApi<RegionView[]>('/regions', 'GET');
}

export function getEventForEdit(eventId: number) {
  return callApi<EventDto>(`/events/${eventId}/edit`, 'GET');
}

export function createEvent(event: FormData) {
  return callApi<EventDto>(`/events`, 'POST', event);
}

export function updateEvent(eventId: number, event: FormData) {
  return callApi<EventDto>(`/events/${eventId}`, 'PUT', event);
}

export function getEventMainImage(eventId: number) {
  return callApi<Blob>(`/events/${eventId}/main-image`, 'GET');
}

export function getUserView(userId: number) {
  return callApi<UserView>(`/users/${userId}/view`, 'GET');
}

export function getUserPersonalData(userId: number) {
  return callApi<UserUpdatePersonalData>(
    `/users/${userId}/update/personal-data`,
    'GET'
  );
}

export function updateUserPersonalData(userId: number, user: FormData) {
  return callApi<UserView>(
    `/users/${userId}/update/personal-data`,
    'PUT',
    user
  );
}

export function getUserProfilePicture(userId: number) {
  return callApi<Blob>(`/users/${userId}/profile-picture`, 'GET');
}
