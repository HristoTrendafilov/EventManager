import { useCallback, useEffect, useState } from 'react';

import { getOrganizationMembers } from '~/Infrastructure/ApiRequests/organizations-requests';
import type { UserOrganizationView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { Modal } from '~/Infrastructure/components/Modal/Modal';
import { UserSelect } from '~/User/UserSelect';

interface OrganizationMembersProps {
  organizationId: number;
  onClose: () => void;
}

export function OrganizationMembers(props: OrganizationMembersProps) {
  const { organizationId, onClose } = props;

  const [userSelect, setUserSelect] = useState<boolean>(false);
  const [members, setMembers] = useState<UserOrganizationView[]>([]);
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
            <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
              <button type="button" className="btn btn-success w-100" onClick={showUserSelectModal}>
                Добави Участник
              </button>
              {error && <ErrorMessage error={error} />}
              <hr />
              {members.length > 0 && members.map((x) => <div>{x.username}</div>)}
            </div>
          </div>
        </div>
        {userSelect && <UserSelect onClose={closeUserSelectModal} />}
      </div>
    </Modal>
  );
}
