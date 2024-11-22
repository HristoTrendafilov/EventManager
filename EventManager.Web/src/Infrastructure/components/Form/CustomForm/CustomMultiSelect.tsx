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
  searchable?: boolean;
  placeholder?: string;
  options: SelectInputOption[];
  isNumber?: boolean;
  error?: string;
  readonly?: boolean;
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
    searchable,
    error,
    readonly,
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
            isClearable={!readonly}
            openMenuOnClick={!readonly}
            required={props.required}
            isLoading={loading}
            blurInputOnSelect={false}
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
            isSearchable={searchable}
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
              control: (baseStyles, inputState) => ({
                ...baseStyles,
                border: inputState.isFocused
                  ? '1px solid #0d6efd'
                  : 'var(--input-border)',
                boxShadow: 'none',
                ':hover': {
                  borderColor: 'var(--input-border-color-focused)',
                  outline: 'var(--input-border-color-focused)',
                },
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
