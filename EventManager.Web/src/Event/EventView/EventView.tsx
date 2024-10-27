import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import {
  getEventMainImage,
  getEventSubscribers,
  getEventView,
  subscribeUserToEvent,
  unsubscribeUserFromEvent,
} from '~Infrastructure/ApiRequests/events-requests';
import type { EventSubscribedUser, EventView } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';

import { EventUserCard } from './EventUserCard';

import './EventView.css';

export function EventViewComponent() {
  const [error, setError] = useState<string | undefined>();
  const [subscriptionError, setSubscriptionError] = useState<
    string | undefined
  >();
  const [event, setEvent] = useState<EventView | undefined>();
  const [mainImage, setMainImage] = useState<string | undefined>();
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false);
  const [subscribers, setSubscribers] = useState<EventSubscribedUser[]>([]);

  const { eventId } = useParams();

  const loadSubscribers = useCallback(async () => {
    const subscribersResponse = await getEventSubscribers(Number(eventId));
    if (!subscribersResponse.success) {
      setError(subscribersResponse.errorMessage);
      return;
    }

    setSubscribers(subscribersResponse.data);
  }, [eventId]);

  const subscribeUser = useCallback(async () => {
    const response = await subscribeUserToEvent(Number(eventId));
    if (!response.success) {
      setSubscriptionError(response.errorMessage);
      return;
    }

    setIsUserSubscribed(true);
    await loadSubscribers();
  }, [eventId, loadSubscribers]);

  const unsubscribeUser = useCallback(async () => {
    const response = await unsubscribeUserFromEvent(Number(eventId));
    if (!response.success) {
      setSubscriptionError(response.errorMessage);
      return;
    }

    setIsUserSubscribed(false);
    await loadSubscribers();
  }, [eventId, loadSubscribers]);

  const loadEvent = useCallback(async () => {
    const eventViewResponse = await getEventView(Number(eventId));
    if (!eventViewResponse.success) {
      setError(eventViewResponse.errorMessage);
      return;
    }

    setEvent(eventViewResponse.data);
    setIsUserSubscribed(eventViewResponse.data.isUserSubscribed);

    await loadSubscribers();

    const mainImageResponse = await getEventMainImage(Number(eventId));
    if (!mainImageResponse.success) {
      setError(mainImageResponse.errorMessage);
      return;
    }

    setMainImage(URL.createObjectURL(mainImageResponse.data));
  }, [eventId, loadSubscribers]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  return (
    <div className="event-view-wrapper">
      {event && (
        <div className="container mt-3">
          <h1 className="d-flex justify-content-center">{event.eventName}</h1>
          <div className="row g-2">
            <div className="col-lg-8">
              <div className="main-image-wrapper">
                <img src={mainImage} alt="main" />
              </div>
              <div className="card mt-2">
                <div className="card-header">Описание</div>
                <p className="card-body">{event.eventDescription}</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>Участници ({subscribers.length})</div>
                    {!isUserSubscribed && (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={subscribeUser}
                      >
                        Запиши се
                      </button>
                    )}
                    {isUserSubscribed && (
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={unsubscribeUser}
                      >
                        Отпиши ме
                      </button>
                    )}
                  </div>
                  {error && <ErrorMessage error={subscriptionError} />}
                </div>
                <div className="card-body subscribers">
                  <div className="d-flex flex-column gap-1">
                    {subscribers.map((x) => (
                      <EventUserCard key={x.userId} user={x} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
