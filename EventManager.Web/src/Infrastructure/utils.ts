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
