import { useCallback, useState } from 'react';

import type { OrganizationUser } from '~/Infrastructure/api-types';
import { ConfirmModal } from '~/Infrastructure/components/ConfirmModal/ConfirmModal';

interface OrganizationManagerCardProps {
  member: OrganizationUser;
  onDeleted: (userId: number) => void;
}

export function OrganizationManagerCard(props: OrganizationManagerCardProps) {
  const { member, onDeleted } = props;

  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const showConfirmModal = useCallback(() => {
    setConfirmModal(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal(false);
  }, []);

  const handleDeleteClick = useCallback(() => {
    closeConfirmModal();
    onDeleted(member.userId);
  }, [closeConfirmModal, member.userId, onDeleted]);

  return (
    <div key={member.userId} className="card mb-1">
      <div className="card-body p-1 d-flex">
        <img src={member.userProfilePictureUrl} width={45} height={45} className="rounded-circle" alt="" />
        <div className="d-flex flex-column ms-2">
          <div className="fw-bold">{member.username}</div>
          <div className="small">{member.userFullName}</div>
          <button
            type="button"
            className="btn btn-danger position-absolute end-0 me-2 mt-1 px-3"
            onClick={showConfirmModal}
          >
            X
          </button>
        </div>
      </div>
      {confirmModal && (
        <ConfirmModal
          message="Сигурни ли сте, че искате да изтриете този мениджър?"
          onConfirm={handleDeleteClick}
          onCancel={closeConfirmModal}
        />
      )}
    </div>
  );
}
