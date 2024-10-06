import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bg from 'date-fns/locale/bg';
import { type ComponentProps, forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';

import '~Infrastructure/components/Form/DateInput/DateInput.css';
import '~Infrastructure/components/Form/SharedForm.css';

interface CustomDateInputProps extends ComponentProps<'input'> {
  name: string;
  label: string;
}

export const CustomDateInput = forwardRef<DatePicker, CustomDateInputProps>(
  (props, ref) => {
    const { name, label, required } = props;

    registerLocale('bg', bg);

    const { getFieldState, formState, control } = useFormContext();
    const state = getFieldState(name, formState);

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
              onChange={field.onChange}
              id={name}
              showTimeSelect
              selected={field.value ? new Date(field.value as string) : null}
              dateFormat="Pp"
              locale="bg"
              timeFormat="HH:mm"
              timeIntervals={15}
              showYearDropdown
              onFocus={(e) => {
                e.target.blur();
              }}
              required={required}
              onChangeRaw={(e) => e?.preventDefault()}
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
