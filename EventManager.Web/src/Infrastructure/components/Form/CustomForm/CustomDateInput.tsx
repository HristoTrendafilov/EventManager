import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bg from 'date-fns/locale/bg';
import { type ComponentProps, forwardRef, useCallback, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useFormContext } from 'react-hook-form';

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

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const { getFieldState, formState, setValue } = useFormContext();
    const state = getFieldState(name, formState);

    const handleChange = useCallback(
      (date: Date | null) => {
        setValue(name, date);
        setSelectedDate(date);
      },
      [name, setValue]
    );

    return (
      <div className="date-input-wrapper">
        <label className="date-input-label" htmlFor={name}>
          {label}
        </label>
        <DatePicker
          ref={ref}
          className="date-input"
          onChange={handleChange}
          showTimeSelect
          selected={selectedDate}
          dateFormat="Pp"
          locale="bg"
          timeFormat="HH:mm"
          timeIntervals={15}
          showYearDropdown
          onKeyDown={(e) => e.preventDefault()}
          required={required}
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
