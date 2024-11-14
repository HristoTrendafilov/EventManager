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
import { type FieldValues, useFormContext } from 'react-hook-form';

interface CustomCheckboxProps extends ComponentProps<'input'> {
  name: string;
  label: string;
}

export const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
  (props, ref) => {
    const { getFieldState, formState, setValue } =
      useFormContext<FieldValues>();
    const state = getFieldState(props.name, formState);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Checkbox-specific handler for toggling checked state
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setValue(props.name, event.target.checked);
      },
      [props.name, setValue]
    );

    // Scroll into view if there’s an error
    useEffect(() => {
      if (state.error && wrapperRef.current) {
        wrapperRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, [state.error]);

    return (
      <div className="checkbox-wrapper" ref={wrapperRef}>
        <label className="checkbox-label" htmlFor={props.name}>
          <input
            {...props}
            type="checkbox"
            ref={ref}
            id={props.name}
            checked={props.checked}
            onChange={handleChange}
            className="checkbox-input"
          />
          {props.label}
        </label>
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
