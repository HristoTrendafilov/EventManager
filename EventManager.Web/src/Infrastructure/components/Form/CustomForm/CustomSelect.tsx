import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ComponentProps, forwardRef, useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, {
  type ActionMeta,
  type SelectInstance,
  type SingleValue,
} from 'react-select';

import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import type { SelectInputOption } from '~Infrastructure/components/Form/SelectInput/selectInputUtils';

import '~Infrastructure/components/Form/SelectInput/SelectInput.css';

export interface CustomSelectProps extends ComponentProps<'select'> {
  name: string;
  label: string;
  loading?: boolean;
  placeholder?: string;
  options: SelectInputOption[];
  isNumber?: boolean;
  error?: string;
}

export const CustomSelect = forwardRef<
  SelectInstance<SelectInputOption>,
  CustomSelectProps
>((props, ref) => {
  const {
    name,
    label,
    loading,
    placeholder,
    options,
    disabled,
    required,
    isNumber = false,
    error,
  } = props;
  const { control, getFieldState } = useFormContext();
  const state = getFieldState(name);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.error && wrapperRef.current) {
      wrapperRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [state.error]);

  return (
    <div className="select-input-wrapper" ref={wrapperRef}>
      <label className="select-input-label" htmlFor={name}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            ref={ref}
            required={required}
            id={name}
            isLoading={loading}
            isDisabled={disabled}
            value={
              options.find((x) => {
                if (isNumber) {
                  return Number(x.value) === Number(field.value);
                }

                return x.value === field.value;
              }) ?? null
            }
            options={options}
            noOptionsMessage={() => 'Няма повече елементи за избор'}
            isSearchable
            placeholder={<div>{placeholder ?? 'Избор...'}</div>}
            onChange={(
              newSelections: SingleValue<SelectInputOption>,
              _: ActionMeta<SelectInputOption>
            ) => {
              field.onChange(
                isNumber ? Number(newSelections?.value) : newSelections?.value
              );
            }}
            styles={{
              control: (baseStyles, _) => ({
                ...baseStyles,
                borderColor: 'var(--input-border-color)',
                border: 'var(--input-border-color)',
              }),
            }}
          />
        )}
      />
      {state.error && (
        <p className="input-validation-error">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {state.error.message?.toString()}
        </p>
      )}
      {error && <ErrorMessage error={error} />}
    </div>
  );
});
