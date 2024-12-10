import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getOrganizationView,
  subscribeUserToOrganization,
  unsubscribeUserFromOrganization,
} from '~/Infrastructure/ApiRequests/organizations-requests';
import type { OrganizationView } from '~/Infrastructure/api-types';
import { ConfirmModal } from '~/Infrastructure/components/ConfirmModal/ConfirmModal';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { userSelector } from '~/Infrastructure/redux/user-slice';

import { OrganizationMembers } from './OrganizationMembers/OrganizationMembers';

export function OrganizationViewComponent() {
  const [error, setError] = useState<string | undefined>();
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false);
  const [subscriptionError, setSubscriptionError] = useState<string | undefined>();
  const [organization, setOrganization] = useState<OrganizationView | undefined>();
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [membersModal, setMembersModal] = useState<boolean>(false);

  const { organizationId } = useParams();
  const user = useSelector(userSelector);

  const showMembersModal = useCallback(() => {
    setMembersModal(true);
  }, []);

  const closeMembersModal = useCallback(() => {
    setMembersModal(false);
  }, []);

  const showConfirmModal = useCallback(() => {
    setConfirmModal(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal(false);
  }, []);

  const subscribeUser = useCallback(async () => {
    const response = await subscribeUserToOrganization(Number(organizationId));
    if (!response.success) {
      setSubscriptionError(response.errorMessage);
      return;
    }

    setIsUserSubscribed(true);
  }, [organizationId]);

  const unsubscribeUser = useCallback(async () => {
    const response = await unsubscribeUserFromOrganization(Number(organizationId));
    if (!response.success) {
      setSubscriptionError(response.errorMessage);
      closeConfirmModal();
      return;
    }

    setIsUserSubscribed(false);
    closeConfirmModal();
  }, [closeConfirmModal, organizationId]);

  const loadOrganization = useCallback(async () => {
    const response = await getOrganizationView(Number(organizationId));
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setOrganization(response.data);
    setIsUserSubscribed(response.data.isUserSubscribed);
  }, [organizationId]);

  useEffect(() => {
    void loadOrganization();
  }, [loadOrganization]);

  return (
    <div className="container mt-3 mw-400px">
      {error && <ErrorMessage error={error} />}
      {organization && (
        <div className="card">
          <div className="card-header">
            {organization.canEdit && (
              <div className="position-absolute end-0 pe-3">
                <div className="dropdown">
                  <button
                    className="btn btn-danger dropdown-toggle bs-dropdown-no-icon"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Actions"
                  >
                    <FontAwesomeIcon icon={faGear} />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end p-2">
                    <li>
                      <button type="button" className="btn btn-info w-100" onClick={showMembersModal}>
                        Участници
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="d-flex h-200px">
              <img src={organization.organizationLogoUrl} className="w-100 object-fit-cover" alt="" />
            </div>
          </div>
          <div className="card-body">
            <h4>{organization.organizationName}</h4>
            <p>{organization.organizationDescription}</p>
            {user.isLoggedIn && (
              <div>
                {!isUserSubscribed ? (
                  <button type="button" className="btn btn-success w-100" onClick={subscribeUser}>
                    Абонирай ме
                  </button>
                ) : (
                  <button type="button" className="btn btn-warning w-100" onClick={showConfirmModal}>
                    Премахни абонамент
                  </button>
                )}
                {subscriptionError && <ErrorMessage error={subscriptionError} />}
              </div>
            )}
          </div>
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          message="Сигурни ли сте, че искате да се отпишете от организацията?"
          onCancel={closeConfirmModal}
          onConfirm={unsubscribeUser}
        />
      )}
      {membersModal && organization && (
        <OrganizationMembers onClose={closeMembersModal} organizationId={organization.organizationId} />
      )}
    </div>
  );
}
