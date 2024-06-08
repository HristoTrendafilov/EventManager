import { type ChangeEventHandler, forwardRef, useId } from 'react';

import './TextInput.css';

type TextInputType = 'text' | 'number' | 'password' | 'email';

export type TextInputProps = {
  name: string;
  label: string;
  type?: TextInputType;
  value?: string;
  readonly?: boolean;
  isRequired?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const { name, label, value, readonly, type, isRequired, onChange } = props;

    const id = useId();

    return (
      <div className="text-input-wrapper">
        <label className="text-input-label" htmlFor={id}>
          {label}
        </label>
        <input
          ref={ref}
          className="text-input"
          id={id}
          name={name}
          type={type || 'text'}
          readOnly={readonly}
          value={value}
          required={isRequired}
          onChange={onChange}
        />
      </div>
    );
  }
);
