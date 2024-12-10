import { useCallback, useState } from 'react';

import { removeOrganizationMember } from '~/Infrastructure/ApiRequests/organizations-requests';
import type { UserOrganizationView } from '~/Infrastructure/api-types';
import { ConfirmModal } from '~/Infrastructure/components/ConfirmModal/ConfirmModal';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';

interface OrganizationMemberCardProps {
  organizationId: number;
  member: UserOrganizationView;
  onRemoved: (userOrganizationId: number) => void;
}

export function OrganizationMemberCard(props: OrganizationMemberCardProps) {
  const { organizationId, member, onRemoved } = props;

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

    const response = await removeOrganizationMember(organizationId, member.userId);
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    onRemoved(member.userOrganizationId);
  }, [closeConfirmModal, member.userId, member.userOrganizationId, onRemoved, organizationId]);

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
