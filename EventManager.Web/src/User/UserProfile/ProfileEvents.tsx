import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getUserEventsSubscription } from '~/Infrastructure/ApiRequests/users-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { UserProfileEvent, UserView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { SelectInput } from '~/Infrastructure/components/Form/SelectInput/SelectInput';
import type { SelectInputOption } from '~/Infrastructure/components/Form/SelectInput/selectInputUtils';
import { formatDateTime } from '~/Infrastructure/utils';

interface ProfileEventsProps {
  user: UserView;
}

export function ProfileEvents(props: ProfileEventsProps) {
  const { user } = props;

  const [error, setError] = useState<string | undefined>();
  const [selectValue, setSelectValue] = useState<string>('1');
  const [options, setOptions] = useState<SelectInputOption[]>([
    { value: '1', label: 'Събития за които съм се записал' },
  ]);
  const [events, setEvents] = useState<UserProfileEvent[]>([]);

  const handleInputChange = useCallback(
    async (value: string) => {
      setError(undefined);
      setSelectValue(value);

      const response = await getUserEventsSubscription(user.userId, value);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      setEvents(response.data);
    },
    [user.userId]
  );

  useEffect(() => {
    if (user.isEventManager) {
      setOptions((prevOptions) => {
        const optionExists = prevOptions.some((option) => option.value === '2');
        if (!optionExists) {
          return [...prevOptions, { value: '2', label: 'Събития които съм създал' }];
        }
        return prevOptions;
      });
    }

    void handleInputChange(selectValue);
  }, [handleInputChange, selectValue, user.isEventManager]);

  return (
    <div>
      <SelectInput
        name="eventType"
        label="Тип"
        options={options}
        onChange={handleInputChange}
        loading={false}
        value={selectValue}
      />
      {error && <ErrorMessage error={error} />}

      {events.length > 0 &&
        events.map((event) => (
          <div className="mb-2" key={event.eventId}>
            <Link className="unset-anchor" to={CustomRoutes.eventsView(event.eventId)}>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-sm-4">
                      <div className="d-flex mh-200px">
                        <img className="object-fit-cover w-100" src={event.mainImageUrl} alt={event.eventName} />
                      </div>
                    </div>
                    <div className="col-12 col-sm-8">
                      <div className="d-flex d-sm-block justify-content-center fs-5 fw-bold">{event.eventName}</div>
                      <hr className="m-1" />
                      <div className="clip-7-rows">{event.eventDescription}</div>
                      {selectValue === '1' ? (
                        <div>Записан на: {formatDateTime(event.userSubscribedOnDateTime)}</div>
                      ) : (
                        <div>Създаден на: {formatDateTime(event.eventCreatedOnDateTime)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}
