import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { getEventSearch } from '~Infrastructure/ApiRequests/events-requests';
import { CustomRoutes } from '~Infrastructure/Routes/CustomRoutes';
import {
  EventSearchFilterSchema,
  type EventSearchFilterType,
  type EventView,
  type PaginationMetadata,
} from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';

import { EventSearchCard } from './EventSearchCard';

import './EventSearch.css';

const defaultValues: EventSearchFilterType = {
  eventName: '',
  pageSize: 10,
};

export function EventSearch() {
  const [events, setEvents] = useState<EventView[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<
    PaginationMetadata | undefined
  >();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page } = useParams();
  const form = useZodForm({
    schema: EventSearchFilterSchema,
    defaultValues: page
      ? {
          eventName: searchParams.get('eventName'),
        }
      : defaultValues,
  });

  const loadEvents = useCallback(
    async (pageNumber: number) => {
      const response = await getEventSearch(pageNumber, {
        eventName: searchParams.get('eventName'),
        pageSize: Number(searchParams.get('pageSize')),
      });
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      const paginationHeader = response.headers.get('X-Pagination');
      if (paginationHeader) {
        const paginationValue = JSON.parse(
          paginationHeader
        ) as PaginationMetadata;
        setPagination(paginationValue);
      }

      setEvents(response.data);

      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [searchParams]
  );

  const navigateTo = useCallback(
    (pageNumber: number) => {
      const formValues = form.getValues();

      // Construct the query string dynamically
      const queryParams = new URLSearchParams();

      // Dynamically iterate over the keys of `defaultValues`
      (
        Object.keys(defaultValues) as Array<keyof EventSearchFilterType>
      ).forEach((key) => {
        const value = formValues[key]; // Access the value from form
        if (value) {
          queryParams.append(key, value.toString()); // Add key-value pairs dynamically
        }
      });

      navigate(
        `${CustomRoutes.eventsSearchPage(pageNumber)}?${queryParams.toString()}`
      );
    },
    [form, navigate]
  );

  const handleSubmit = useCallback(() => {
    navigateTo(1);
  }, [navigateTo]);

  useEffect(() => {
    if (page) {
      void loadEvents(Number(page));
    }
  }, [loadEvents, page]);

  return (
    <div className="event-search-wrapper mt-3">
      <div className="container">
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <div className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Филтър
              </button>
            </div>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <CustomForm form={form} onSubmit={handleSubmit}>
                  <CustomInput
                    {...form.register('eventName')}
                    label="Име на събитието"
                  />
                  <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary w-200px">
                      Търси
                    </button>
                  </div>
                </CustomForm>
              </div>
            </div>
          </div>
        </div>
        {error && <ErrorMessage error={error} />}
        <div>
          {events.length > 0 &&
            events.map((x) => <EventSearchCard key={x.eventId} event={x} />)}
        </div>
      </div>

      {pagination && (
        <nav aria-label="Page navigation" className="w-100">
          <ul className="pagination d-flex flex-wrap justify-content-center mt-4">
            {/* Previous Button */}
            <li className="page-item">
              <button
                type="button"
                className={`page-link ${
                  pagination.currentPage === 1 ? 'disabled' : ''
                }`}
                onClick={() => navigateTo(pagination.currentPage - 1)}
                aria-label="previous"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            </li>

            {/* Dynamic Page Buttons */}
            {Array.from({ length: pagination.totalPages }, (_, index) => {
              const pageX = index + 1;
              const isNearCurrentPage =
                pageX === pagination.currentPage ||
                Math.abs(pageX - pagination.currentPage) <= 2;

              if (isNearCurrentPage) {
                return (
                  <li key={pageX} className="page-item">
                    <button
                      type="button"
                      className={`page-link ${
                        pagination.currentPage === pageX ? 'active' : ''
                      }`}
                      onClick={() => navigateTo(pageX)}
                    >
                      {pageX}
                    </button>
                  </li>
                );
              }

              return null; // Do not render pages far from the current page
            })}

            {/* Next Button */}
            <li className="page-item">
              <button
                type="button"
                className={`page-link ${
                  pagination.currentPage === pagination.totalPages
                    ? 'disabled'
                    : ''
                }`}
                onClick={() => navigateTo(pagination.currentPage + 1)}
                aria-label="next"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
