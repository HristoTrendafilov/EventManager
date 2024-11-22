import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import {
  getEventMainImage,
  getEventSubscribers,
  getEventView,
  subscribeUserToEvent,
  unsubscribeUserFromEvent,
} from '~Infrastructure/ApiRequests/events-requests';
import { CustomRoutes } from '~Infrastructure/Routes/CustomRoutes';
import type { EventView, UserEventView } from '~Infrastructure/api-types';
import { ConfirmModal } from '~Infrastructure/components/ConfirmModal/ConfirmModal';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { ImageGalleryModal } from '~Infrastructure/components/ImageGalleryModal/ImageGalleryModal';
import { userSelector } from '~Infrastructure/redux/user-slice';
import { formatDateTime } from '~Infrastructure/utils';
import noImage from '~asset/no-image.png';

import { EventUserCard } from './EventUserCard';

import './EventView.css';

export function EventViewComponent() {
  const [error, setError] = useState<string | undefined>();
  const [subscriptionError, setSubscriptionError] = useState<
    string | undefined
  >();

  const [event, setEvent] = useState<EventView | undefined>();
  const [mainImage, setMainImage] = useState<string>(noImage);
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false);
  const [subscribers, setSubscribers] = useState<UserEventView[]>([]);
  const [gallery, setGallery] = useState<boolean>(false);

  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const user = useSelector(userSelector);

  const { eventId } = useParams();

  const showConfirmModal = useCallback(() => {
    setConfirmModal(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal(false);
  }, []);

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
    subscribers.unshift(response.data);
  }, [eventId, subscribers]);

  const unsubscribeUser = useCallback(async () => {
    const response = await unsubscribeUserFromEvent(Number(eventId));
    if (!response.success) {
      setSubscriptionError(response.errorMessage);
      closeConfirmModal();
      return;
    }

    setIsUserSubscribed(false);

    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter(
        (subscriber) => subscriber.userEventId !== response.data.primaryKey
      )
    );
    closeConfirmModal();
  }, [closeConfirmModal, eventId]);

  const loadEvent = useCallback(async () => {
    const eventViewResponse = await getEventView(Number(eventId));
    if (!eventViewResponse.success) {
      setError(eventViewResponse.errorMessage);
      return;
    }

    setEvent(eventViewResponse.data);
    setIsUserSubscribed(eventViewResponse.data.isUserSubscribed);

    await loadSubscribers();

    if (eventViewResponse.data.hasMainImage) {
      const mainImageResponse = await getEventMainImage(Number(eventId));
      if (!mainImageResponse.success) {
        setError(mainImageResponse.errorMessage);
        return;
      }

      setMainImage(URL.createObjectURL(mainImageResponse.data));
    }
  }, [eventId, loadSubscribers]);

  const showGallery = useCallback(() => {
    setGallery(true);
  }, []);

  const closeGallery = useCallback(() => {
    setGallery(false);
  }, []);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  useEffect(
    () => () => {
      URL.revokeObjectURL(mainImage);
    },
    [mainImage]
  );

  return (
    <div className="event-view-wrapper">
      {event && (
        <div className="container mt-3 mb-2">
          <h1 className="d-flex justify-content-center">{event.eventName}</h1>

          <div className="row g-2">
            <div className="col-lg-8">
              <button className="unset-btn" type="button" onClick={showGallery}>
                <div className="main-image-wrapper">
                  <img src={mainImage} alt="main" />
                </div>
              </button>

              <div className="card mt-2">
                <h4 className="card-header d-flex justify-content-between align-items-center">
                  <div>Описание</div>

                  {event.canEdit && (
                    <Link
                      to={CustomRoutes.eventsUpdate(event.eventId)}
                      className="btn btn-primary"
                    >
                      Редакция
                    </Link>
                  )}
                </h4>

                <div className="card-body">
                  <div>Начало: {formatDateTime(event.eventStartDateTime)}</div>

                  <div>
                    Край:{' '}
                    {event.eventEndDateTime &&
                      formatDateTime(event.eventEndDateTime)}
                  </div>

                  <div>Регион: {event.regionName}</div>

                  <div>
                    Създаден от:{' '}
                    <Link
                      to={CustomRoutes.usersView(event.eventCreatedByUserId)}
                    >
                      {event.createdByUsername}
                    </Link>
                  </div>

                  <hr />

                  <div className="pre-wrap">{event.eventDescription}</div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card subscribers-card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Участници ({subscribers.length})</h5>

                    {user.isLoggedIn && (
                      <div>
                        {!isUserSubscribed ? (
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={subscribeUser}
                            disabled={event.eventHasEnded}
                          >
                            Запиши се
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={showConfirmModal}
                          >
                            Отпиши ме
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {!user.isLoggedIn && (
                    <div className="d-flex align-items-center gap-1">
                      <FontAwesomeIcon icon={faInfoCircle} color="blue" />

                      <div className="fst-italic">
                        Моля, влезте в акаунта си, за да се запишете.
                      </div>
                    </div>
                  )}

                  {error && <ErrorMessage error={subscriptionError} />}
                </div>

                <div className="card-body p-2">
                  <div className="d-flex flex-column gap-1 subscribers ">
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

      {gallery && (
        <div>
          <ImageGalleryModal
            items={[{ original: mainImage }]}
            onCloseButtonClick={closeGallery}
          />
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          message="Сигурни ли сте, че искате да се отпишете от събитието?"
          onCancel={closeConfirmModal}
          onConfirm={unsubscribeUser}
        />
      )}
    </div>
  );
}
