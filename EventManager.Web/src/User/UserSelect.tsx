import { Modal } from '~/Infrastructure/components/Modal/Modal';

interface UserSelectProps {
  onClose: () => void;
}

export function UserSelect(props: UserSelectProps) {
  const { onClose } = props;

  return (
    <Modal onBackdropClick={onClose}>
      <div className="container">
        <div className="mw-800px m-70auto">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h4>Избор на потребител</h4>
              <button type="button" className="btn btn-warning" onClick={onClose}>
                Затвори
              </button>
            </div>
            <div className="card-body" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
