import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import type { ValidationPropertyError } from '~Infrastructure/api-client';

export function setValidationErrors<T extends FieldValues>(
  validationErrors: ValidationPropertyError[],
  setError: UseFormSetError<T>
) {
  validationErrors.forEach((error) => {
    setError(error.propertyName as Path<T>, { message: error.errorMessage });
  });
}
