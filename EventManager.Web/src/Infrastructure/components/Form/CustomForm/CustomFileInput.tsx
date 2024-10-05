import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  type ChangeEvent,
  type ComponentProps,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';

import '~Infrastructure/components/Form/FileInput/FileInput.css';
import '~Infrastructure/components/Form/SharedForm.css';

interface CustomFileInputProps extends ComponentProps<'input'> {
  name: string;
  label: string;
}

export const CustomFileInput = forwardRef<
  HTMLInputElement,
  CustomFileInputProps
>((props, ref) => {
  const { name, label } = props;

  const [selectedFileName, setSelectedFileName] = useState<string | null>();

  const { getFieldState, formState } = useFormContext();
  const state = getFieldState(name, formState);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;

      if (files && files.length > 0) {
        const fileNames = Array.from(files)
          .map((file) => file.name)
          .join(', ');

        setSelectedFileName(fileNames);

        if (props.onChange) {
          props.onChange(event);
        }
      }
    },
    [props]
  );

  const handleClearInput = useCallback(() => {
    setSelectedFileName(null);
  }, []);

  return (
    <div className="file-input-wrapper">
      <label className="file-input-label" htmlFor={name}>
        {label}
      </label>
      <div className="file-input">
        <div className="file-input-names">{selectedFileName}</div>
        <input
          {...props}
          ref={ref}
          id={name}
          type="file"
          onChange={handleChange}
          multiple
        />
        <div className="clear-button-wrapper">
          <button
            type="button"
            className="clear-button"
            onClick={handleClearInput}
          >
            X
          </button>
        </div>
      </div>

      {state.error && (
        <p className="input-validation-error">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {state.error.message?.toString()}
        </p>
      )}
    </div>
  );
});
