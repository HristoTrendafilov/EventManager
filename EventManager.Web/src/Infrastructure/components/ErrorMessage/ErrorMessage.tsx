import type { CSSProperties } from 'react';

import './ErrorMessage.css';

interface ErrorMessageProps {
  error: unknown;
  style?: CSSProperties;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function ErrorMessage(props: ErrorMessageProps) {
  const { error, style } = props;

  return (
    <div role="alert" className="system-error-message" style={style}>
      {isError(error) && <div>{error.message}</div>}
      {isString(error) && <div>{error}</div>}
    </div>
  );
}
