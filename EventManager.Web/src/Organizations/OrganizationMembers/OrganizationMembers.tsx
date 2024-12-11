import { useCallback, useEffect, useState } from 'react';

import { addMembersToOrganization, getOrganizationMembers } from '~/Infrastructure/ApiRequests/organizations-requests';
import type { OrganizationMemberView, OrganizationUser, UserSearch } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { Modal } from '~/Infrastructure/components/Modal/Modal';
import { UserSelect } from '~/User/UserSelect';

import { OrganizationMemberCard } from './OrganizationMemberCard';

interface OrganizationMembersProps {
  organizationId: number;
  onClose: () => void;
}

export function OrganizationMembers(props: OrganizationMembersProps) {
  const { organizationId, onClose } = props;

  const [userSelect, setUserSelect] = useState<boolean>(false);
  const [members, setMembers] = useState<OrganizationMemberView[]>([]);
  const [error, setError] = useState<string | undefined>();

  const showUserSelectModal = useCallback(() => {
    setUserSelect(true);
  }, []);

  const closeUserSelectModal = useCallback(() => {
    setUserSelect(false);
  }, []);

  const loadMembers = useCallback(async () => {
    const response = await getOrganizationMembers(organizationId);
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setMembers(response.data);
  }, [organizationId]);

  const handleDeletedMember = useCallback(
    (organizationMemberId: number) => {
      setMembers(members.filter((x) => x.organizationMemberId !== organizationMemberId));
    },
    [members]
  );

  const addMembers = useCallback(
    async (uesrs: UserSearch[]) => {
      const organizationUsers: OrganizationUser[] = uesrs.map((x) => ({
        userId: x.userId,
        isManager: false,
      }));

      const response = await addMembersToOrganization(organizationId, { users: organizationUsers });
      if (!response.success) {
        closeUserSelectModal();
        setError(response.errorMessage);
        return;
      }

      closeUserSelectModal();
      void loadMembers();
    },
    [closeUserSelectModal, loadMembers, organizationId]
  );

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  return (
    <Modal onBackdropClick={onClose}>
      <div className="container">
        <div className="mw-500px m-70auto">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>Участници</h4>
              <button type="button" className="btn btn-warning" onClick={onClose}>
                Затвори
              </button>
            </div>
            <div className="card-body h-400px overflow-auto">
              {error && <ErrorMessage error={error} />}
              {members.length > 0 &&
                members.map((x) => (
                  <OrganizationMemberCard
                    key={x.userId}
                    organizationId={organizationId}
                    member={x}
                    onDeleted={handleDeletedMember}
                  />
                ))}
            </div>
            <div className="card-footer">
              <button type="button" className="btn btn-success w-100" onClick={showUserSelectModal}>
                Добави Участник
              </button>
            </div>
          </div>
        </div>
        {userSelect && (
          <UserSelect
            onClose={closeUserSelectModal}
            onSelected={addMembers}
            alreadySelectedUsersIds={members.map((x) => x.userId)}
          />
        )}
      </div>
    </Modal>
  );
}
