import { forwardRef, useCallback } from 'react';

import { CustomFileInput, type CustomFileInputProps } from './CustomFileInput';

export const CustomButtonFileInput = forwardRef<
  HTMLInputElement,
  CustomFileInputProps
>((props, ref) => {
  const { name, label, onFileChosen, onFileRemoved } = props;

  const handleButtonClick = useCallback(() => {
    const fileInput = document.querySelector(`#${name}`) as HTMLInputElement;

    if (fileInput) {
      fileInput.click();
    }
  }, [name]);

  return (
    <>
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
    </>
  );
});
