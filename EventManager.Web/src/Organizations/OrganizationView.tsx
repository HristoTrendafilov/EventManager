import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import {
  getOrganizationView,
  subscribeUserToOrganization,
  unsubscribeUserFromOrganization,
} from '~/Infrastructure/ApiRequests/organizations-requests';
import { useScrollPosition } from '~/Infrastructure/CustomHooks/useScrollPosition';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { OrganizationView } from '~/Infrastructure/api-types';
import { ConfirmModal } from '~/Infrastructure/components/ConfirmModal/ConfirmModal';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { userSelector } from '~/Infrastructure/redux/user-slice';
import { formatDateTime } from '~/Infrastructure/utils';

import { OrganizationMembers } from './OrganizationMembers/OrganizationMembers';

export function OrganizationViewComponent() {
  const [error, setError] = useState<string | undefined>();
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false);
  const [subscriptionError, setSubscriptionError] = useState<string | undefined>();
  const [organization, setOrganization] = useState<OrganizationView | undefined>();
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [membersModal, setMembersModal] = useState<boolean>(false);

  const { saveScrollPosition, restoreScrollPosition } = useScrollPosition();

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
    restoreScrollPosition();
  }, [organizationId, restoreScrollPosition]);

  useEffect(() => {
    void loadOrganization();
  }, [loadOrganization]);

  return (
    <div className="container mt-3">
      {error && <ErrorMessage error={error} />}
      {organization && (
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card _primary-border shadow">
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
          </div>
          <div className="col-md-8">
            <h4>Събития, създадени от организацията</h4>
            <hr />
            {organization.events.length > 0 ? (
              organization.events.map((x) => (
                <div key={x.eventId} className="mb-2">
                  <Link className="unset-anchor" to={CustomRoutes.eventsView(x.eventId)} onClick={saveScrollPosition}>
                    <div className="card _primary-border shadow">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12 col-sm-4">
                            <div className="d-flex h-200px">
                              <img className="object-fit-cover w-100" src={x.mainImageUrl} alt={x.organizationName} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-8">
                            <div className="d-flex d-sm-block justify-content-center fs-5 fw-bold">{x.eventName}</div>
                            <hr className="m-1" />
                            <div className="clip-7-rows">{x.eventDescription}</div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <div>Създаден на: {formatDateTime(x.eventCreatedOnDateTime)}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <h4>Тази организация все още няма създадени събития</h4>
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
