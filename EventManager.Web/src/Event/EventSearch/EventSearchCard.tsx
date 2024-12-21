import { Link } from 'react-router-dom';

import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { EventView } from '~/Infrastructure/api-types';

import './EventSearchCard.css';

interface EventSearchCardProps {
  event: EventView;
}

export function EventSearchCard(props: EventSearchCardProps) {
  const { event } = props;

  return (
    <div className="event-search-card-wrapper mt-3">
      <div className="container">
        <Link to={CustomRoutes.eventsView(event.eventId)} className=" unset-anchor">
          <div className="row border">
            <div className="col-md-5 col-lg-3 p-0 d-flex justify-content-center bg-secondary-subtle">
              <div className="d-flex" style={{ height: '215px' }}>
                <img className="object-fit-cover object-pos-center w-100" src={event.mainImageUrl} alt="main" />
              </div>
            </div>
            <div className="col-md-7 col-lg-9">
              <div className="d-flex flex-column p-1">
                <h4>{event.eventName}</h4>
                <p className="clip-7-rows text-muted">{event.eventDescription}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
