import { useCallback, useEffect, useState } from 'react';

import { getHomeView } from '~Infrastructure/ApiRequests/home-requests';
import type { EventView } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';

import { CarouselEvent } from './CarouselEvent';

import './Home.css';

export function Home() {
  const [error, setError] = useState<string | undefined>();
  const [incomingEvents, setIncomingEvents] = useState<EventView[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0); // Track the active index

  const loadView = useCallback(async () => {
    const response = await getHomeView();
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setIncomingEvents(response.data.incommingEvents);
  }, []);

  useEffect(() => {
    document.title = 'Събития | Начало';
    void loadView();
  }, [loadView]);

  return (
    <div className="home-wrapper">
      {error && <ErrorMessage error={error} />}
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {incomingEvents.map((x, i) => (
            <button
              key={x.eventId}
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to={i}
              className={i === activeIndex ? 'active' : ''}
              aria-current={i === activeIndex ? 'true' : undefined}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActiveIndex(i)} // Update active index on click
            />
          ))}
        </div>
        <div className="carousel-inner">
          {incomingEvents.map((event, i) => (
            <CarouselEvent
              key={event.eventId}
              event={event}
              isActive={i === activeIndex}
            />
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
          onClick={() =>
            setActiveIndex((prev) =>
              prev === 0 ? incomingEvents.length - 1 : prev - 1
            )
          }
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
          onClick={() =>
            setActiveIndex((prev) =>
              prev === incomingEvents.length - 1 ? 0 : prev + 1
            )
          }
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
