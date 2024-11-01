import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  type ChangeEvent,
  type ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
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

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (props.type === 'number') {
          const value = Number(event.target.value);
          setValue(props.name, value);
        } else {
          setValue(props.name, event.target.value);
        }
      },
      [props.name, props.type, setValue]
    );

    useEffect(() => {
      if (state.error && wrapperRef.current) {
        wrapperRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, [state.error]);

    return (
      <div className="text-input-wrapper" ref={wrapperRef}>
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
