import { forwardRef, useCallback } from 'react';

import { CustomFileInput, type CustomFileInputProps } from './CustomFileInput';

export const CustomFileInputButton = forwardRef<
  HTMLInputElement,
  CustomFileInputProps
>((props, ref) => {
  const { name, label, className, onFileChosen, onFileRemoved } = props;

  const handleButtonClick = useCallback(() => {
    const fileInput = document.querySelector(`#${name}`) as HTMLInputElement;

    if (fileInput) {
      fileInput.click();
    }
  }, [name]);

  return (
    <div className={`d-flex flex-column align-items-center ${className}`}>
      <button
        type="button"
        className="btn btn-success"
        onClick={handleButtonClick}
      >
        {label}
      </button>
      <CustomFileInput
        {...props}
        name={name}
        label={label}
        ref={ref}
        wrapperClassName="d-none"
        onFileChosen={onFileChosen}
        onFileRemoved={onFileRemoved}
      />
    </div>
  );
});
