import { callApi } from '~Infrastructure/api-client';
import type { EventDto } from '~Infrastructure/api-types';

export function getEventForUpdate(eventId: number) {
  return callApi<EventDto>(`/events/${eventId}/update`, 'GET');
}

export function updateEvent(eventId: number, event: FormData) {
  return callApi<EventDto>(`/events/${eventId}/update`, 'PUT', event);
}

export function createEvent(event: FormData) {
  return callApi<EventDto>(`/events/new`, 'POST', event);
}

export function getEventMainImage(eventId: number) {
  return callApi<Blob>(`/events/${eventId}/main-image`, 'GET');
}
