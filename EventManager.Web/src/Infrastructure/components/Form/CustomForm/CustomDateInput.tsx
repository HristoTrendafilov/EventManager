import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bg from 'date-fns/locale/bg';
import { type ComponentProps, forwardRef, useCallback, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';

import '~Infrastructure/components/Form/DateInput/DateInput.css';
import '~Infrastructure/components/Form/SharedForm.css';

interface CustomDateInputProps extends ComponentProps<'input'> {
  name: string;
  label: string;
  showTime?: boolean;
  timeInterval?: number;
}

export const CustomDateInput = forwardRef<DatePicker, CustomDateInputProps>(
  (props, ref) => {
    const { name, label, required, showTime, timeInterval } = props;

    const [open, setOpen] = useState<boolean>(false);
    const [previousDate, setPreviousDate] = useState<Date | null>(null);

    registerLocale('bg', bg);

    const { getFieldState, formState, control } = useFormContext();
    const state = getFieldState(name, formState);

    const isTimeChanged = useCallback(
      (prevDate: Date | null, newDate: Date) =>
        prevDate &&
        prevDate.toDateString() === newDate.toDateString() &&
        prevDate.getTime() !== newDate.getTime(),
      []
    );

    return (
      <div className="date-input-wrapper">
        <label className="date-input-label" htmlFor={name}>
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <DatePicker
              ref={ref}
              className="date-input"
              onChange={(date) => {
                field.onChange(date);

                if (!showTime) {
                  setOpen(false);
                  return;
                }

                if (date instanceof Date && !Number.isNaN(date.getTime())) {
                  if (isTimeChanged(previousDate, date)) {
                    setOpen(false);
                  }

                  setPreviousDate(date); // Update previous date
                }
              }}
              onInputClick={() => {
                setOpen(true);
              }}
              onClickOutside={() => setOpen(false)}
              id={name}
              showTimeSelect={showTime}
              selected={field.value ? new Date(field.value as string) : null}
              dateFormat={showTime ? 'Pp' : 'P'} // Use only date format when showTime is false
              locale="bg"
              timeFormat="HH:mm"
              timeIntervals={timeInterval ?? 15}
              showYearDropdown
              required={required}
              onChangeRaw={(e) => e?.preventDefault()}
              readOnly
              open={open}
            />
          )}
        />

        {state.error && (
          <p className="input-validation-error">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {state.error.message?.toString()}
          </p>
        )}
      </div>
    );
  }
);
