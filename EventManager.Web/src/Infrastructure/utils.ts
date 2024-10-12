export function reportError(error: unknown) {
  /* eslint-disable no-console */
  console.error(error);
  /* eslint-enable no-console */
}

export function getClientErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Системна грешка. Миля, опитайте по-късно или се свържете със системния администратор.';
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function appendToFormData<T extends object>(
  formData: FormData,
  obj: T,
  parentKey?: string
): void {
  Object.entries(obj).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key; // Construct the key

    if (value) {
      if (value instanceof FileList) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < value.length; i++) {
          formData.append(formKey, value[i]);
        }
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          // If it's an array, recursively append each item
          appendToFormData(formData, item, formKey);
        });
      } else if (value instanceof Date) {
        formData.append(
          formKey,
          value.toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' })
        );
      } else if (typeof value === 'object') {
        // Recursively append objects
        appendToFormData(formData, value, formKey);
      } else {
        // For primitive types (string, number, etc.)
        formData.append(formKey, value as string);
      }
    }
  });
}

// Main function to convert any object to FormData
export const objectToFormData = <T extends object>(obj: T): FormData => {
  const formData = new FormData();
  appendToFormData(formData, obj);
  return formData;
};
