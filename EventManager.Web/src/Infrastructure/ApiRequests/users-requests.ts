import { callApi } from '~/Infrastructure/api-client';
import type {
  OrganizationView,
  RoleBaseFormType,
  RoleView,
  UserForUpdate,
  UserForWeb,
  UserLoginType,
  UserPreview,
  UserProfileEvent,
  UserProfileOrganization,
  UserSearch,
  UserSearchFilterType,
  UserUpdatePasswordType,
  UserUpdatePersonalDataResponse,
  UserUpdateUsernameType,
  UserVerifyEmail,
  UserView,
} from '~/Infrastructure/api-types';
import type { UserProfileEventType, UserProfileOrganizationType } from '~/User/user-utils';

export function registerUser(user: FormData) {
  return callApi('/users', 'POST', user);
}

export function logoutUser() {
  return callApi('/users/logout', 'POST');
}

export function getUserView(userId: number) {
  return callApi<UserView>(`/users/${userId}/view`, 'GET');
}

export function getAllRoles() {
  return callApi<RoleView[]>(`/users/roles`, 'GET');
}

export function getUserRoles(userId: number) {
  return callApi<UserView>(`/users/${userId}/roles`, 'GET');
}

export function saveUserRoles(userRole: RoleBaseFormType) {
  return callApi(`/users/roles`, 'PUT', JSON.stringify(userRole));
}

export function getUserForUpdate(userId: number) {
  return callApi<UserForUpdate>(`/users/${userId}/update`, 'GET');
}

export function updateUserUsername(userId: number, user: UserUpdateUsernameType) {
  return callApi(`/users/${userId}/update/username`, 'PUT', JSON.stringify(user));
}

export function updateUserPassword(userId: number, password: UserUpdatePasswordType) {
  return callApi(`/users/${userId}/update/password`, 'PUT', JSON.stringify(password));
}

export function updateUserPersonalData(userId: number, user: FormData) {
  return callApi<UserUpdatePersonalDataResponse>(`/users/${userId}/update/personal-data`, 'PUT', user);
}

export function loginUser(req: UserLoginType) {
  return callApi<UserForWeb>('/users/login', 'POST', JSON.stringify(req));
}

export function verifyUserEmail(req: UserVerifyEmail) {
  return callApi<UserForWeb>('/users/email-verification', 'POST', JSON.stringify(req));
}

export function getUserOrganizationsSelect(userId: number) {
  return callApi<OrganizationView[]>(`/users/${userId}/organizations/select`, 'GET');
}

export function searchUsers(filter: UserSearchFilterType) {
  return callApi<UserSearch[]>(`/users/search`, 'POST', JSON.stringify(filter));
}

export function getUsersPreview(usersIds: number[]) {
  const params = new URLSearchParams();
  usersIds.forEach((id) => params.append('usersIds', id.toString()));

  return callApi<UserPreview[]>(`/users/preview?${params.toString()}`, 'GET');
}

export function getUserProfileEvents(userId: number, type: UserProfileEventType) {
  return callApi<UserProfileEvent[]>(`/users/${userId}/profile/events?type=${type}`, 'GET');
}

export function getUserProfileOrganizations(userId: number, type: UserProfileOrganizationType) {
  return callApi<UserProfileOrganization[]>(`/users/${userId}/profile/organizations?type=${type}`, 'GET');
}
