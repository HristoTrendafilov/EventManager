import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getEventMainImage } from '~Infrastructure/ApiRequests/events-requests';
import type { EventView } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import noImage from '~asset/no-image.png';

interface CarouselEventProps {
  event: EventView;
}

export function CarouselEvent(props: CarouselEventProps) {
  const { event } = props;

  const [error, setError] = useState<string | undefined>();
  const [mainImage, setMainImage] = useState<string | undefined>();

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
    } else {
      setMainImage(noImage);
    }
  }, [event.hasMainImage, loadMainImage]);

  return (
    <div className="carousel-item active">
      <div className="home-carousel-img-wrapper">
        {mainImage && (
          <img
            src={mainImage}
            className="d-block w-100 object-fit-cover object-pos-center"
            alt="Event"
          />
        )}
      </div>

      <div className="carousel-caption">
        <h5>{event.eventName}</h5>
        <div className="row carousel-description">
          <div className="col-md-10 d-none d-sm-block">
            <p className="event-carousel-description">
              {event.eventDescription}
            </p>
          </div>
          <div className="col-md-2">
            <Link
              to={`/events/${event.eventId}/view`}
              className="btn z-4 mb-4 btn-primary"
            >
              Към събитието
            </Link>
          </div>
        </div>
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
