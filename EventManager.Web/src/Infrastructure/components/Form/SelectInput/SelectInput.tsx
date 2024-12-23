import { useId } from 'react';
import Select, { type ActionMeta, type SingleValue } from 'react-select';

import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';

import type { SelectInputOption } from './selectInputUtils';

import './SelectInput.css';

export type SelectInputProps = {
  name: string;
  label: string;
  value?: string | number | undefined;
  readonly?: boolean;
  isRequired?: boolean;
  options: SelectInputOption[];
  placeholder?: string;
  loading: boolean;
  error?: string;
  searchable?: boolean;
  onChange: (value: string) => void;
};

export function SelectInput(props: SelectInputProps) {
  const { name, label, value, readonly, isRequired, options, placeholder, loading, error, searchable, onChange } =
    props;

  const id = useId();

  const handleSelectionChange = (newSelection: SingleValue<SelectInputOption>, _: ActionMeta<SelectInputOption>) => {
    if (newSelection) {
      onChange(newSelection.value);
    }
  };

  return (
    <div className="select-input-wrapper">
      <label className="select-input-label" htmlFor={id}>
        {label}
      </label>
      <Select
        className="select-input"
        id={id}
        name={name}
        isLoading={loading}
        isDisabled={readonly || !!error}
        value={options.find((x) => x.value === value) ?? null}
        required={isRequired}
        isSearchable={searchable}
        options={options}
        noOptionsMessage={() => 'Няма повече елементи за избор'}
        placeholder={<div>{placeholder ?? 'Избор...'}</div>}
        onChange={handleSelectionChange}
        styles={{
          control: (baseStyles, inputState) => ({
            ...baseStyles,
            border: inputState.isFocused ? '1px solid #0d6efd' : 'var(--input-border)',
            boxShadow: 'none',
            ':hover': {
              borderColor: 'var(--input-border-color-focused)',
              outline: 'var(--input-border-color-focused)',
            },
          }),
        }}
      />
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
