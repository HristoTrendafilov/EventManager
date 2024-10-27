import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CSSProperties } from 'react';

import { isString } from '~Infrastructure/utils';

import './ErrorMessage.css';

interface ErrorMessageProps {
  error: unknown;
  style?: CSSProperties;
}

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function ErrorMessage(props: ErrorMessageProps) {
  const { error, style } = props;

  return (
    <div role="alert" className="system-error-message" style={style}>
      <FontAwesomeIcon className="me-3" icon={faExclamationCircle} size="xl" />
      {isError(error) && <div>{error.message}</div>}
      {isString(error) && <div>{error}</div>}
    </div>
  );
}
