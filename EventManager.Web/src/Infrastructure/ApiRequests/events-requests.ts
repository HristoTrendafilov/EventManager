import { callApi } from '~Infrastructure/api-client';
import type {
  EventDto,
  EventSubscribedUser,
  EventView,
  SaveEventResponse,
} from '~Infrastructure/api-types';

export function getEventView(eventId: number) {
  return callApi<EventView>(`/events/${eventId}/view`, 'GET');
}

export function getEventForUpdate(eventId: number) {
  return callApi<EventDto>(`/events/${eventId}/update`, 'GET');
}

export function updateEvent(eventId: number, event: FormData) {
  return callApi<SaveEventResponse>(`/events/${eventId}/update`, 'PUT', event);
}

export function createEvent(event: FormData) {
  return callApi<SaveEventResponse>(`/events/new`, 'POST', event);
}

export function getEventMainImage(eventId: number) {
  return callApi<Blob>(`/events/${eventId}/main-image`, 'GET');
}

export function subscribeUserToEvent(eventId: number) {
  return callApi(`/events/${eventId}/subscription`, 'POST');
}

export function unsubscribeUserFromEvent(eventId: number) {
  return callApi(`/events/${eventId}/subscription`, 'DELETE');
}

export function getEventSubscribers(eventId: number) {
  return callApi<EventSubscribedUser[]>(
    `/events/${eventId}/subscribers`,
    'GET'
  );
}
