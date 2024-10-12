import { Modal } from '~Infrastructure/components/Modal/Modal';

import './ErrorModal.css';

interface ErrorModalProps {
  error: string;
  onClose: () => void;
}

export const ErrorModal = (props: ErrorModalProps) => {
  const { error, onClose } = props;

  return (
    <Modal ariaLabel="Error" onBackdropClick={onClose}>
      <div className="error-modal-wrapper">
        <div className="card">
          <h3 className="card-header bg-danger text-white">Грешка</h3>
          <div className="card-body">{error}</div>
          <div className="card-footer">
            <div className="d-flex">
              <button
                type="button"
                className="btn btn-warning w-100"
                onClick={onClose}
              >
                Изход
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
