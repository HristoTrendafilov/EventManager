import type { EventSearchFilter } from '~Event/EventSearch/EventSearch';
import { callApi } from '~Infrastructure/api-client';
import type {
  EventForUpdate,
  EventView,
  PrimaryKeyResponse,
  UserEventView,
} from '~Infrastructure/api-types';

export function getEventView(eventId: number) {
  return callApi<EventView>(`/events/${eventId}/view`, 'GET');
}

export function getEventForUpdate(eventId: number) {
  return callApi<EventForUpdate>(`/events/${eventId}/update`, 'GET');
}

export function updateEvent(eventId: number, event: FormData) {
  return callApi<PrimaryKeyResponse>(`/events/${eventId}/update`, 'PUT', event);
}

export function createEvent(event: FormData) {
  return callApi<PrimaryKeyResponse>(`/events/new`, 'POST', event);
}

export function getEventMainImage(eventId: number) {
  return callApi<Blob>(`/events/${eventId}/main-image`, 'GET');
}

export function subscribeUserToEvent(eventId: number) {
  return callApi<UserEventView>(`/events/${eventId}/subscription`, 'POST');
}

export function unsubscribeUserFromEvent(eventId: number) {
  return callApi<PrimaryKeyResponse>(
    `/events/${eventId}/subscription`,
    'DELETE'
  );
}

export function getEventSubscribers(eventId: number) {
  return callApi<UserEventView[]>(`/events/${eventId}/subscribers`, 'GET');
}

export function getEventSearch(pageNumber: number, filter: EventSearchFilter) {
  return callApi<EventView[]>(
    `/events/search/${pageNumber}`,
    'POST',
    JSON.stringify(filter)
  );
}
