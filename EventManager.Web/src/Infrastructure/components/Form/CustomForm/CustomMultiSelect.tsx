import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select, {
  type ActionMeta,
  type MultiValue,
  type SelectInstance,
  type SingleValue,
} from 'react-select';

import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import type { SelectInputOption } from '~/Infrastructure/components/Form/SelectInput/selectInputUtils';

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

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside wrapper
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setMenuIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            className="select-input"
            ref={ref}
            inputId={name}
            name={name}
            isClearable={!readonly}
            openMenuOnClick={!readonly}
            required={props.required}
            isLoading={loading}
            menuIsOpen={menuIsOpen}
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

              if (!searchable) {
                const input = document.getElementById(name);
                if (input) {
                  input.blur();
                }
              }
            }}
            onMenuOpen={() => {
              if (!searchable) {
                // Blur the input to prevent the keyboard from opening
                const input = document.getElementById(name);
                if (input) {
                  input.blur();
                }
              }
            }}
            onFocus={() => setMenuIsOpen(true)}
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
