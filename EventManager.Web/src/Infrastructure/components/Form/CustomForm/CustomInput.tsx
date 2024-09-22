import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  type ChangeEvent,
  type ComponentProps,
  forwardRef,
  useCallback,
} from 'react';
import { useFormContext } from 'react-hook-form';

import '~Infrastructure/components/Form/SharedForm.css';
import '~Infrastructure/components/Form/TextInput/TextInput.css';

interface CustomInputProps extends ComponentProps<'input'> {
  name: string;
  label: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => {
    const { getFieldState, formState, setValue } = useFormContext();
    const state = getFieldState(props.name, formState);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setValue(props.name, event.target.value);
      },
      [props.name, setValue]
    );

    return (
      <div className="text-input-wrapper">
        <label className="text-input-label" htmlFor={props.name}>
          {props.label}
        </label>
        <input
          {...props}
          type={props.type || 'text'}
          ref={ref}
          className="text-input"
          id={props.name}
          onChange={handleChange}
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
