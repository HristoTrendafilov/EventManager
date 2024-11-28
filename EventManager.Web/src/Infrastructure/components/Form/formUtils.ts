import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import type { ValidationPropertyError } from '~/Infrastructure/api-client';

export function setValidationErrors<T extends FieldValues>(
  validationErrors: ValidationPropertyError[],
  setError: UseFormSetError<T>
) {
  validationErrors.forEach((error) => {
    setError(error.propertyName as Path<T>, { message: error.errorMessage });
  });
}

export enum FileType {
  Images = 'image/*',
  Excel = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  PDFs = 'application/pdf',
  All = '*/*',
}
