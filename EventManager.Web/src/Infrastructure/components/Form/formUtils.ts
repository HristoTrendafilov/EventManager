import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import type { ValidationPropertyError } from '~/Infrastructure/api-client';

// eslint-disable-next-line no-shadow
export enum FileInputTypeEnum {
  Images = 'image/*',
  Excel = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  PDFs = 'application/pdf',
  All = '*/*',
}

export function setValidationErrors<T extends FieldValues>(
  validationErrors: ValidationPropertyError[],
  setError: UseFormSetError<T>
) {
  validationErrors.forEach((error) => {
    setError(error.propertyName as Path<T>, { message: error.errorMessage });
  });
}
