import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ComponentProps, forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, {
  type ActionMeta,
  type MultiValue,
  type SelectInstance,
  type SingleValue,
} from 'react-select';

import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import type { SelectInputOption } from '~Infrastructure/components/Form/SelectInput/selectInputUtils';

export interface CustomMultiSelectProps extends ComponentProps<'select'> {
  name: string;
  label: string;
  loading?: boolean;
  placeholder?: string;
  options: SelectInputOption[];
  isNumber?: boolean;
  error?: string;
}

export const CustomMultiSelect = forwardRef<
  SelectInstance<SelectInputOption>,
  CustomMultiSelectProps
>((props, ref) => {
  const {
    name,
    label,
    loading,
    placeholder,
    options,
    disabled,
    isNumber = false,
    error,
  } = props;
  const { control, getFieldState } = useFormContext();
  const state = getFieldState(name);

  return (
    <div className="select-input-wrapper">
      <label className="select-input-label" htmlFor={name}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            className="select-input"
            ref={ref}
            inputId={name}
            name={name}
            required={props.required}
            isLoading={loading}
            isDisabled={disabled}
            value={options.filter((x) => {
              if (isNumber) {
                return (
                  (field.value as number[])?.includes(Number(x.value)) ?? null
                );
              }

              return (field.value as string[])?.includes(x.value) ?? null;
            })}
            options={options}
            closeMenuOnSelect={false}
            isClearable
            isSearchable
            placeholder={<div>{placeholder ?? 'Избор...'}</div>}
            noOptionsMessage={() => 'Няма повече елементи за избор'}
            onChange={(
              newValue:
                | MultiValue<SelectInputOption>
                | SingleValue<SelectInputOption>,
              _: ActionMeta<SelectInputOption>
            ) => {
              const newSelections = newValue as SelectInputOption[];
              field.onChange(
                newSelections.map((selection) =>
                  isNumber ? Number(selection.value) : selection.value
                )
              );
            }}
            styles={{
              control: (baseStyles, _) => ({
                ...baseStyles,
                borderColor: 'var(--input-border-color)',
                border: 'var(--input-border-color)',
              }),
            }}
            isMulti
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
