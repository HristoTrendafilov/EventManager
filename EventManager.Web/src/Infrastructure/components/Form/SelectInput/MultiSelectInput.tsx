import { useEffect, useId, useState } from 'react';
import Select, { type ActionMeta, type MultiValue } from 'react-select';

import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import type { SelectInputOption } from '~/Infrastructure/components/Form/SelectInput/selectInputUtils';

import './SelectInput.css';

export type MultiSelectInputProps = {
  name: string;
  label: string;
  values: string[];
  readonly?: boolean;
  isRequired?: boolean;
  options: SelectInputOption[];
  placeholder?: string;
  loading: boolean;
  error?: string;
  onChange: (options: string[]) => void;
};

export function MultiSelectInput(props: MultiSelectInputProps) {
  const {
    name,
    label,
    values,
    readonly,
    isRequired,
    options,
    placeholder,
    loading,
    error,
    onChange,
  } = props;

  const [selectedOptions, setSelectedOptions] = useState<SelectInputOption[]>();

  const id = useId();

  const handleSelectionChange = (
    newSelections: MultiValue<SelectInputOption>,
    _: ActionMeta<SelectInputOption>
  ) => {
    if (newSelections) {
      const selectedValues = newSelections.map((x) => x.value);
      onChange(selectedValues);
    }
  };

  useEffect(() => {
    const defaultOptions = options.filter((x) =>
      values.some((y) => y === x.value)
    );
    setSelectedOptions(defaultOptions);
  }, [options, values]);

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
        value={selectedOptions}
        required={isRequired}
        options={options}
        closeMenuOnSelect={false}
        isClearable
        isSearchable
        placeholder={<div>{placeholder ?? 'Избор...'}</div>}
        noOptionsMessage={() => 'Няма повече елементи за избор'}
        onChange={handleSelectionChange}
        styles={{
          control: (baseStyles, _) => ({
            ...baseStyles,
            borderColor: 'var(--input-border-color)',
            border: 'var(--input-border-color)',
          }),
        }}
        isMulti
      />
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
