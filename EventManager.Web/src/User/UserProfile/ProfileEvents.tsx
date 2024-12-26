import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { SelectInput } from '~/Infrastructure/components/Form/SelectInput/SelectInput';
import type { SelectInputOption } from '~/Infrastructure/components/Form/SelectInput/selectInputUtils';
import { formatDateTime } from '~/Infrastructure/utils';
import { UserProfileEventType } from '~/User/user-utils';

import type { UserEventsOptions } from './UserProfile';

interface ProfileEventsProps {
  userIsEventManager: boolean;
  options: UserEventsOptions;
  saveScrollPosition: () => void;
  onInputChange: (value: string) => void;
}

export function ProfileEvents(props: ProfileEventsProps) {
  const { userIsEventManager, saveScrollPosition, onInputChange, options } = props;
  const { events, error, type, hasLoadedOnce } = options;

  const [selectOptions, setSelectOptions] = useState<SelectInputOption[]>([
    { value: UserProfileEventType.Subscriptions.toString(), label: 'Събития за които съм се записал' },
  ]);

  useEffect(() => {
    if (userIsEventManager) {
      setSelectOptions((prevOptions) => {
        const optionExists = prevOptions.some((option) => option.value === UserProfileEventType.Created.toString());
        if (!optionExists) {
          return [
            ...prevOptions,
            { value: UserProfileEventType.Created.toString(), label: 'Събития които съм създал' },
          ];
        }
        return prevOptions;
      });
    }
  }, [userIsEventManager]);

  const loadInitial = useCallback(() => {
    if (events.length === 0 && !hasLoadedOnce) {
      onInputChange(options.type);
    }
  }, [events.length, hasLoadedOnce, onInputChange, options.type]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  return (
    <div>
      <SelectInput
        name="eventType"
        label="Тип"
        options={selectOptions}
        onChange={onInputChange}
        loading={false}
        searchable={false}
        value={type}
      />
      {error && <ErrorMessage error={error} />}

      {events.length > 0 &&
        events.map((event) => (
          <div className="mb-2" key={event.eventId}>
            <Link className="unset-anchor" to={CustomRoutes.eventsView(event.eventId)} onClick={saveScrollPosition}>
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
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  {type === UserProfileEventType.Subscriptions.toString() ? (
                    <div>Записан на: {formatDateTime(event.userSubscribedOnDateTime)}</div>
                  ) : (
                    <div>Създаден на: {formatDateTime(event.eventCreatedOnDateTime)}</div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}
