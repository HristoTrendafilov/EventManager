import { useCallback, useRef, useState } from 'react';
import { z } from 'zod';

import { getEventSearch } from '~Infrastructure/ApiRequests/events-requests';
import type { EventView, PaginationHeader } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';

import { EventSearchCard } from './EventSearchCard';

import './EventSearch.css';

const schema = z.object({
  eventName: z.string(),
  pageSize: z.number(),
});

export type EventSearchFilter = z.infer<typeof schema>;

const defaultValues: EventSearchFilter = {
  eventName: '',
  pageSize: 5,
};

export function EventSearch() {
  const [events, setEvents] = useState<EventView[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<PaginationHeader | undefined>();

  const form = useZodForm({ schema, defaultValues });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const loadEvents = useCallback(
    async (pageNumber: number, scrollToTop: boolean = true) => {
      const response = await getEventSearch(pageNumber, form.getValues());
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      const paginationHeader = response.headers.get('X-Pagination');
      if (paginationHeader) {
        const paginationValue = JSON.parse(
          paginationHeader
        ) as PaginationHeader;
        setPagination(paginationValue);
      }

      setEvents(response.data);

      if (wrapperRef.current && scrollToTop) {
        wrapperRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        });
      }
    },
    [form]
  );

  const handleSubmit = useCallback(async () => {
    await loadEvents(1, false);
  }, [loadEvents]);

  return (
    <div className="event-search-wrapper mt-3">
      <div className="container">
        <div ref={wrapperRef} className="accordion" id="accordionExample">
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
                  <CustomInput
                    {...form.register('pageSize')}
                    label="Брой"
                    type="number"
                  />
                  <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary">
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
        <nav aria-label="Page navigation" className="table-responsive">
          <ul className="pagination d-flex justify-content-center mt-4">
            <li className="page-item">
              <button
                type="button"
                className={`page-link ${
                  pagination.currentPage === 1 ? 'disabled' : ''
                }`}
                onClick={() => loadEvents(pagination.currentPage - 1)}
              >
                Предишна
              </button>
            </li>

            {Array.from({ length: pagination.totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <li key={page} className="page-item">
                  <button
                    type="button"
                    className={`page-link ${
                      pagination.currentPage === page ? 'active' : ''
                    }`}
                    onClick={() => loadEvents(page)}
                  >
                    {page}
                  </button>
                </li>
              );
            })}

            <li className="page-item">
              <button
                type="button"
                className={`page-link ${
                  pagination.currentPage === pagination.totalPages
                    ? 'disabled'
                    : ''
                }`}
                onClick={() => loadEvents(pagination.currentPage + 1)}
              >
                Следваща
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
