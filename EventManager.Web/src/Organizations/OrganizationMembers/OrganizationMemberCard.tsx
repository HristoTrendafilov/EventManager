import { useCallback, useState } from 'react';

import { deleteOrganizationMember } from '~/Infrastructure/ApiRequests/organizations-requests';
import type { OrganizationMemberView } from '~/Infrastructure/api-types';
import { ConfirmModal } from '~/Infrastructure/components/ConfirmModal/ConfirmModal';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';

interface OrganizationMemberCardProps {
  organizationId: number;
  member: OrganizationMemberView;
  onDeleted: (organizationMemberId: number) => void;
}

export function OrganizationMemberCard(props: OrganizationMemberCardProps) {
  const { organizationId, member, onDeleted } = props;

  const [error, setError] = useState<string | undefined>();
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const showConfirmModal = useCallback(() => {
    setConfirmModal(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal(false);
  }, []);

  const handleDeleteClick = useCallback(async () => {
    closeConfirmModal();

    const response = await deleteOrganizationMember(organizationId, member.userId);
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    onDeleted(member.organizationMemberId);
  }, [closeConfirmModal, member, onDeleted, organizationId]);

  return (
    <div key={member.userId} className="card mb-1">
      <div className="card-body p-1 d-flex flex-grow-1 position-relative">
        {member.isManager && (
          <span className="position-absolute end-0 badge rounded-pill bg-primary fw-medium me-2">Мениджър</span>
        )}
        <img src={member.userProfilePictureUrl} width={45} height={45} className="rounded-circle" alt="" />
        <div className="d-flex flex-column ms-2">
          <div className="fw-bold">{member.username}</div>

          <div className="small">{member.userFullName}</div>
          {!member.isManager && (
            <button
              type="button"
              className="btn btn-danger position-absolute end-0 me-2 mt-1 px-3"
              onClick={showConfirmModal}
            >
              X
            </button>
          )}
        </div>
      </div>
      {error && <ErrorMessage error={error} />}
      {confirmModal && (
        <ConfirmModal
          message="Сигурни ли сте, че искате да изтриете този член на организацията?"
          onConfirm={handleDeleteClick}
          onCancel={closeConfirmModal}
        />
      )}
    </div>
  );
}
