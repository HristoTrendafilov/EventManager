import { Modal } from '~/Infrastructure/components/Modal/Modal';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal(props: ConfirmModalProps) {
  const { message, onConfirm, onCancel } = props;

  return (
    <Modal onBackdropClick={onCancel}>
      <div className="container">
        <div className="mw-500px m-70auto">
          <div className="card">
            <h3 className="card-header">Потвърждение</h3>
            <div className="card-body">{message}</div>
            <div className="card-footer d-flex gap-3">
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={onConfirm}
              >
                Потвърждавам
              </button>
              <button
                type="button"
                className="btn btn-warning w-100"
                onClick={onCancel}
              >
                Отказ
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
