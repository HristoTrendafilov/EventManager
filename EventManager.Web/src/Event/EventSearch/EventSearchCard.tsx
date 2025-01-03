import { Link } from 'react-router-dom';

import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { EventView } from '~/Infrastructure/api-types';

interface EventSearchCardProps {
  event: EventView;
  saveScrollPosition: () => void;
}

export function EventSearchCard(props: EventSearchCardProps) {
  const { event, saveScrollPosition } = props;

  return (
    <div className="card shadow _primary-border my-3">
      <div className="card-body">
        <Link to={CustomRoutes.eventsView(event.eventId)} className=" unset-anchor" onClick={saveScrollPosition}>
          <div className="row">
            <div className="col-md-5 col-lg-3">
              <div className="d-flex h-200px">
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
