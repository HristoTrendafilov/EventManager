import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ChangeEvent, type ComponentProps, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import '~Infrastructure/components/Form/SharedForm.css';
import '~Infrastructure/components/Form/TextArea/TextArea.css';

interface CustomTextAreaProps extends ComponentProps<'textarea'> {
  name: string;
  label: string;
}

export const CustomTextArea = (props: CustomTextAreaProps) => {
  const { name, label } = props;

  const { getFieldState, formState, setValue } = useFormContext();
  const state = getFieldState(name, formState);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(name, event.target.value);
    },
    [name, setValue]
  );

  return (
    <div className="textarea-wrapper">
      <label className="textarea-label" htmlFor={name}>
        {label}
      </label>
      <textarea
        {...props}
        className="textarea-input"
        id={name}
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
};
