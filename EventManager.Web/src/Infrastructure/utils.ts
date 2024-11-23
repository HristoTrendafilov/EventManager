export function reportError(error: unknown) {
  /* eslint-disable no-console */
  console.error(error);
  /* eslint-enable no-console */
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function formatDate(date: Date | string): string {
  if (isString(date)) {
    date = new Date(date);
  }

  return date.toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  if (isString(date)) {
    date = new Date(date);
  }

  return date.toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
      } else if (value instanceof File) {
        formData.append(formKey, value);
      }
      // else if (Array.isArray(value)) {
      //   value.forEach((item) => {
      //     // If it's an array, recursively append each item
      //     appendToFormData(formData, item, formKey);
      //   });
      // }
      else if (value instanceof Date) {
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

export const convertToFileList = (files: File[]): FileList => {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
};
