import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { z } from 'zod';

import { getEventSearch } from '~Infrastructure/ApiRequests/events-requests';
import type { EventDto } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';

import './EventSearch.css';

const schema = z.object({
  eventName: z.string(),
  pageSize: z.number(),
});

export type EventSearchFilter = z.infer<typeof schema>;

const defaultValues: EventSearchFilter = {
  eventName: '',
  pageSize: 20,
};

export function EventSearch() {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [error, setError] = useState<string | undefined>();

  const form = useZodForm({ schema });

  const { page } = useParams();

  const handleSubmit = useCallback(
    async (filter: EventSearchFilter) => {
      const response = await getEventSearch(Number(page), filter);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      setEvents(response.data);
    },
    [page]
  );

  useEffect(() => {
    form.reset(defaultValues);
    void handleSubmit(defaultValues);
  }, [form, handleSubmit]);

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
        {events.length > 0 &&
          events.map((x) => <div key={x.eventId}>{x.eventName}</div>)}
      </div>
    </div>
  );
}
