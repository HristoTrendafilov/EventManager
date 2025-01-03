import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bg } from 'date-fns/locale';
import { type ComponentProps, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';

import '~/Infrastructure/components/Form/DateInput/DateInput.css';
import '~/Infrastructure/components/Form/SharedForm.css';
import { formatToISO } from '~/Infrastructure/utils';

interface CustomDateInputProps extends ComponentProps<'input'> {
  name: string;
  label: string;
  showTime?: boolean;
  timeInterval?: number;
  nullable?: boolean;
  addAsterisk?: boolean;
}

export const CustomDateInput = forwardRef<DatePicker, CustomDateInputProps>((props, ref) => {
  const { name, label, required, showTime, timeInterval, nullable } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [previousDate, setPreviousDate] = useState<Date | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { getFieldState, formState, control, setValue } = useFormContext();
  const state = getFieldState(name, formState);

  const isTimeChanged = useCallback(
    (prevDate: Date | null, newDate: Date) =>
      prevDate && prevDate.toDateString() === newDate.toDateString() && prevDate.getTime() !== newDate.getTime(),
    []
  );

  const handleClearInput = useCallback(() => {
    setValue(props.name, null);
  }, [props.name, setValue]);

  const handleInputClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    if (state.error) {
      wrapperRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [state.error, name]);

  return (
    <>
      <div className="date-input-wrapper" ref={wrapperRef}>
        <label className="date-input-label" htmlFor={name}>
          {label}
          {props.addAsterisk && <span className="text-danger">*</span>}
        </label>
        <div className="date-input">
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <DatePicker
                ref={ref}
                onChange={(date) => {
                  const formatted = formatToISO(date);
                  field.onChange(formatted);

                  if (!showTime) {
                    setOpen(false);
                    return;
                  }

                  if (date instanceof Date && !Number.isNaN(date.getTime())) {
                    if (isTimeChanged(previousDate, date)) {
                      setOpen(false);
                    }

                    setPreviousDate(date);
                  }
                }}
                onInputClick={handleInputClick}
                id={name}
                showTimeSelect={showTime}
                selected={field.value ? new Date(field.value as string) : null}
                dateFormat={showTime ? "d MMMM yyyy 'г.' HH:mm" : "d MMMM yyyy 'г.'"}
                locale={bg} // Set locale to Bulgarian
                timeFormat="HH:mm"
                timeIntervals={timeInterval ?? 30}
                dayClassName={(date) => (date.getDay() === 0 || date.getDay() === 6 ? 'highlight-weekend' : '')}
                showYearDropdown
                required={required}
                open={open}
                readOnly
              />
            )}
          />
          {nullable && (
            <div className="clear-button-wrapper">
              <button type="button" className="clear-button" onClick={handleClearInput}>
                X
              </button>
            </div>
          )}
        </div>
      </div>
      {state.error && (
        <p className="input-validation-error mt-minus-10px">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {state.error.message?.toString() === 'Invalid date' ? 'Изберете дата' : state.error.message?.toString()}
        </p>
      )}
    </>
  );
});
