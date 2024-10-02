import bg from 'date-fns/locale/bg';
import { useCallback, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { z } from 'zod';

import type { EventForm } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { getClientErrorMessage } from '~Infrastructure/utils';
import { RegionSelect } from '~Shared/SmartSelects/Region/RegionSelect';

import './Event.css';

const schema = z.object({
  eventName: z.string(),
  eventDescription: z.string().nullable(),
  eventStartDateTime: z.date(),
  eventEndDateTime: z.date().nullable(),
  regionId: z.number(),
}) satisfies z.ZodType<EventForm>;

export function Event() {
  const [error, setError] = useState<string>();
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  registerLocale('bg', bg);

  const handleLogin = useCallback((data: EventForm) => {
    setError(undefined);

    try {
      /* eslint-disable no-console */
      console.log(data.eventDescription);
      /* eslint-enable no-console */
    } catch (err) {
      setError(getClientErrorMessage(err));
    }
  }, []);

  const form = useZodForm({ schema });

  return (
    <div className="event-wrapper">
      <div className="card border-1 border-danger">
        <h2 className="card-header text-white bg-danger bg-gradient">
          Ново събитие
        </h2>

        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <CustomForm form={form} onSubmit={handleLogin}>
                <CustomInput
                  {...form.register('eventName')}
                  label="Наименование"
                  required
                />
                <CustomTextArea
                  {...form.register('eventDescription')}
                  label="Описание"
                />
                <RegionSelect
                  {...form.register('regionId')}
                  label="Регион на събитието"
                  isNumber
                  required
                />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  locale="bg" // Set locale to Bulgarian
                  timeFormat="HH:mm" // Use 24-hour time format
                  timeIntervals={15} // Optional: Set time intervals (e.g., every 15 minutes)
                  withPortal
                  showYearDropdown
                />
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Създай
                  </button>
                </div>
              </CustomForm>
            </div>
          </div>
        </div>
        {error && (
          <div className="card-footer">
            <ErrorMessage error={error} />
          </div>
        )}
      </div>
    </div>
  );
}
