import { callApi } from '~/Infrastructure/api-client';
import type {
  EventView,
  OrganizationForUpdate,
  OrganizationMemberView,
  OrganizationMembersNew,
  OrganizationView,
} from '~/Infrastructure/api-types';

export function getAllOrganizationsView() {
  return callApi<OrganizationView[]>(`/organizations`, 'GET');
}

export function getOrganizationView(organizationId: number) {
  return callApi<OrganizationView>(`/organizations/${organizationId}/view`, 'GET');
}

export function updateOrganization(organizationId: number, organization: FormData) {
  return callApi<OrganizationView>(`/organizations/${organizationId}/update`, 'PUT', organization);
}

export function getOrganizationForUpdate(organizationId: number) {
  return callApi<OrganizationForUpdate>(`/organizations/${organizationId}/update`, 'GET');
}

export function createOrganization(organization: FormData) {
  return callApi<OrganizationView>(`/organizations/new`, 'POST', organization);
}

export function subscribeUserToOrganization(organizationId: number) {
  return callApi(`/organizations/${organizationId}/subscription`, 'POST');
}

export function unsubscribeUserFromOrganization(organizationId: number) {
  return callApi(`/organizations/${organizationId}/subscription`, 'DELETE');
}

export function addMembersToOrganization(organizationId: number, users: OrganizationMembersNew) {
  return callApi(`/organizations/${organizationId}/members`, 'POST', JSON.stringify(users));
}

export function deleteOrganizationMember(organizationId: number, userId: number) {
  return callApi(`/organizations/${organizationId}/members?userId=${userId}`, 'DELETE');
}

export function getOrganizationMembers(organizationId: number, usersIds?: number[]) {
  const params = new URLSearchParams();

  if (usersIds && usersIds.length > 0) {
    usersIds.forEach((id) => params.append('userIds', id.toString()));
  }
  return callApi<OrganizationMemberView[]>(`/organizations/${organizationId}/members?${params.toString()}`, 'GET');
}

export function getOrganizationEvents(organizationId: number) {
  return callApi<EventView[]>(`/organizations/${organizationId}/events`, 'GET');
}
