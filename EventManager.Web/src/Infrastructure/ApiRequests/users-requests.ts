import { callApi } from '~Infrastructure/api-client';
import type { UserLoginResponseDto, UserView } from '~Infrastructure/api-types';
import type { UserLogin } from '~User/Login/Login';
import type { UpdatePersonalDataForm } from '~User/UserUpdate/UpdatePersonalData';
import type { UserUpdatePassword } from '~User/UserUpdate/UserSecurity';

export function registerUser(user: FormData) {
  return callApi('/users', 'POST', user);
}

export function logoutUser() {
  return callApi('/users/logout', 'POST');
}

export function getUserView(userId: number) {
  return callApi<UserView>(`/users/${userId}/view`, 'GET');
}

export function getUserForUpdate(userId: number) {
  return callApi<UserView>(`/users/${userId}/update`, 'GET');
}

export function getUserProfilePicture(userId: number) {
  return callApi<Blob>(`/users/${userId}/profile-picture`, 'GET');
}

export function updateUserUsername(userId: number, username: string) {
  return callApi(
    `/users/${userId}/update/username?username=${username}`,
    'PUT'
  );
}

export function updateUserPassword(
  userId: number,
  password: UserUpdatePassword
) {
  return callApi(
    `/users/${userId}/update/password`,
    'PUT',
    JSON.stringify(password)
  );
}

export function getUserPersonalData(userId: number) {
  return callApi<UpdatePersonalDataForm>(
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

export function loginUser(req: UserLogin) {
  return callApi<UserLoginResponseDto>(
    '/users/login',
    'POST',
    JSON.stringify(req)
  );
}
