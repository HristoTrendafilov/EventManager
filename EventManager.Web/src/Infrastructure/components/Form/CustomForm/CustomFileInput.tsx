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

export interface CustomFileInputProps extends ComponentProps<'input'> {
  name: string;
  label: string;
  wrapperClassName?: string;
  onFileChosen?: (file: File) => void;
  onFileRemoved?: () => void;
}

export const CustomFileInput = forwardRef<
  HTMLInputElement,
  CustomFileInputProps
>((props, ref) => {
  const { wrapperClassName, onFileChosen, onFileRemoved, ...rest } = props;

  const [selectedFileName, setSelectedFileName] = useState<string | null>();

  const { getFieldState, formState, resetField } = useFormContext();
  const state = getFieldState(props.name, formState);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      // event.target.value = '';
      if (props.onChange) {
        props.onChange(event);
      }
      const { files } = event.target;

      if (files && files.length > 0) {
        const fileNames = Array.from(files)
          .map((file) => file.name)
          .join(', ');

        setSelectedFileName(fileNames);

        if (onFileChosen) {
          onFileChosen(files[0]);
        }
      }
    },
    [props, onFileChosen]
  );

  const handleClearInput = useCallback(() => {
    resetField(props.name);
    setSelectedFileName(null);

    if (onFileRemoved) {
      onFileRemoved();
    }
  }, [resetField, onFileRemoved, props]);

  return (
    <div className={`file-input-wrapper ${wrapperClassName ?? ''}`}>
      <label className="file-input-label" htmlFor={props.name}>
        {props.label}
      </label>
      <div className="file-input">
        <div className="file-input-names">{selectedFileName}</div>
        <input
          {...rest}
          ref={ref}
          id={props.name}
          type="file"
          multiple={false}
          onChange={handleChange}
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
