import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getEventMainImage } from '~/Infrastructure/ApiRequests/events-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { EventView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import noImage from '~/asset/no-image.png';

import './EventSearchCard.css';

interface EventSearchCardProps {
  event: EventView;
}

export function EventSearchCard(props: EventSearchCardProps) {
  const { event } = props;

  const [error, setError] = useState<string | undefined>();
  const [mainImage, setMainImage] = useState<string>(noImage);

  const loadMainImage = useCallback(async () => {
    const response = await getEventMainImage(Number(event.eventId));
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setMainImage(URL.createObjectURL(response.data));
  }, [event.eventId]);

  useEffect(() => {
    if (event.hasMainImage) {
      void loadMainImage();
    }
  }, [event.hasMainImage, loadMainImage]);

  useEffect(
    () => () => {
      URL.revokeObjectURL(mainImage);
    },
    [mainImage]
  );

  return (
    <div className="event-search-card-wrapper mt-3">
      <div className="container">
        <Link
          to={CustomRoutes.eventsView(event.eventId!)}
          className=" unset-anchor"
        >
          <div className="row border">
            <div className="col-md-5 col-lg-3 p-0 d-flex justify-content-center bg-secondary-subtle">
              <div className="d-flex" style={{ height: '215px' }}>
                <img
                  className="object-fit-cover object-pos-center w-100"
                  src={mainImage}
                  alt="main"
                />
              </div>
            </div>
            <div className="col-md-7 col-lg-9">
              <div className="d-flex flex-column p-1">
                <h4>{event.eventName}</h4>
                <p className="event-description text-muted">
                  {event.eventDescription}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
