import { Link } from 'react-router-dom';

import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { EventView } from '~/Infrastructure/api-types';

interface CarouselEventProps {
  event: EventView;
  isActive: boolean;
}

export function CarouselEvent(props: CarouselEventProps) {
  const { event, isActive } = props;

  return (
    <div className={`carousel-item ${isActive ? 'active' : ''}`}>
      <div className="home-carousel-img-wrapper">
        <img
          src={event.mainImageUrl}
          className="w-100 object-fit-cover object-pos-center"
          alt="Event"
        />
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
              to={CustomRoutes.eventsView(event.eventId)}
              className="btn z-4 mb-4 btn-primary"
            >
              Към събитието
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
