import { callApi } from '~/Infrastructure/api-client';
import type {
  OrganizationForUpdate,
  OrganizationView,
} from '~/Infrastructure/api-types';

export function getAllOrganizationsView() {
  return callApi<OrganizationView[]>(`/organizations`, 'GET');
}

export function getOrganizationView(organizationId: number) {
  return callApi<OrganizationView>(
    `/organizations/${organizationId}/view`,
    'GET'
  );
}

export function updateOrganization(
  organizationId: number,
  organization: FormData
) {
  return callApi<OrganizationView>(
    `/organizations/${organizationId}/update`,
    'PUT',
    organization
  );
}

export function getOrganizationForUpdate(organizationId: number) {
  return callApi<OrganizationForUpdate>(
    `/organizations/${organizationId}/update`,
    'GET'
  );
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

export function addUserToOrganization(organizationId: number) {
  return callApi(`/organizations/${organizationId}/members`, 'POST');
}

export function removeUserFromOrganization(organizationId: number) {
  return callApi(`/organizations/${organizationId}/members`, 'DELETE');
}
