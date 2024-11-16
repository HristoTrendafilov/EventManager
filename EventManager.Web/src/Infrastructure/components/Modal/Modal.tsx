import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

import './Modal.css';

interface ModalProps {
  children: ReactNode;
  onBackdropClick?: () => void;
  ariaLabel?: string;
}

export function Modal(props: ModalProps) {
  const { children, onBackdropClick, ariaLabel } = props;

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Disable scroll

    return () => {
      document.body.style.overflow = 'auto'; // Clean up when modal is unmounted or closed
    };
  }, []);

  return createPortal(
    <div className="_modal-wrapper" role="dialog" aria-label={ariaLabel}>
      <button
        type="button"
        className="_modal-backdrop"
        onClick={onBackdropClick}
        aria-label="modal backdrop"
      />
      <div className="_modal-content">{children}</div>
    </div>,
    document.body
  );
}
