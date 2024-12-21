import { faEnvelope, faHouse, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getUserView } from '~/Infrastructure/ApiRequests/users-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { UserView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { ImageGalleryModal } from '~/Infrastructure/components/ImageGalleryModal/ImageGalleryModal';

import { ProfileAboutMe } from './ProfileAboutMe';
import { ProfileEvents } from './ProfileEvents';
import { ProfileOrganizations } from './ProfileOrganizations';

import './UserProfile.css';

type UserTab = 'aboutMe' | 'organization' | 'events';

export function UserProfile() {
  const [userView, setUserView] = useState<UserView | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [selectedTab, setSelectedTab] = useState<UserTab>('aboutMe');
  const [showGallery, setShowGallery] = useState<boolean>(false);

  const { userId } = useParams();

  const fetchUserView = useCallback(async () => {
    const userViewResponse = await getUserView(Number(userId));
    if (!userViewResponse.success) {
      setError(userViewResponse.errorMessage);
      return;
    }

    setUserView(userViewResponse.data);
  }, [userId]);

  const handleShowGallery = useCallback(() => {
    setShowGallery(true);
  }, []);

  const handleCloseGallery = useCallback(() => {
    setShowGallery(false);
  }, []);

  const renderTabContent = useCallback(
    () => (
      <>
        <div style={{ display: selectedTab === 'aboutMe' ? 'block' : 'none' }}>
          <ProfileAboutMe user={userView!} />
        </div>
        <div style={{ display: selectedTab === 'organization' ? 'block' : 'none' }}>
          <ProfileOrganizations />
        </div>
        <div style={{ display: selectedTab === 'events' ? 'block' : 'none' }}>
          <ProfileEvents user={userView!} />
        </div>
      </>
    ),
    [selectedTab, userView]
  );

  const additionalTabs = [
    { key: 'events', label: 'Събития' },
    { key: 'organization', label: 'Организации' },
  ];

  useEffect(() => {
    void fetchUserView();
  }, [fetchUserView]);

  return (
    <div className="user-profile-wrapper mt-3">
      {error && <ErrorMessage error={error} />}

      {userView && (
        <section className="container mw-900px">
          <div className="card">
            <div className="card-body">
              <div className="row g-2">
                <div className="col-sm-4">
                  <div className="user-profile-info">
                    <button
                      type="button"
                      className="unset-btn d-flex justify-content-center"
                      aria-label="Open gallery"
                      onClick={handleShowGallery}
                    >
                      <img
                        src={userView.userProfilePictureUrl}
                        alt="User profile"
                        width={120}
                        height={120}
                        className="rounded-circle"
                      />
                    </button>
                    <div className="fs-4 fw-bold">{userView.username}</div>
                    <div className="text-muted text-center">
                      <p>{userView.userFullName}</p>
                    </div>
                    {userView.canEdit && (
                      <div className="w-100 px-2">
                        <Link to={CustomRoutes.usersUpdate(userView.userId)} className="btn btn-primary w-100">
                          Редация
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-sm-8 d-flex flex-column ps-md-4">
                  <div>Помагам в:</div>
                  <ul>
                    {userView.regionsHelping.map((x) => (
                      <li key={x.regionId}>{x.regionName}</li>
                    ))}
                  </ul>

                  <div className="text-muted mt-auto">
                    <div className="d-flex gap-2 mb-1">
                      <div>
                        <FontAwesomeIcon className="fa-fw" color="grey" icon={faHouse} size="lg" />
                      </div>
                      <div>{userView.regionName}</div>
                    </div>
                    <div className="d-flex gap-2 mb-1">
                      <div>
                        <FontAwesomeIcon className="fa-fw" color="grey" icon={faEnvelope} size="lg" />
                      </div>
                      <div>{userView.userEmail}</div>
                    </div>
                    <div className="d-flex gap-2">
                      <div>
                        <FontAwesomeIcon className="fa-fw" color="grey" icon={faPhone} size="lg" />
                      </div>
                      <div>{userView.userPhoneNumber}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul className="nav nav-tabs mt-2">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${selectedTab === 'aboutMe' ? 'active' : ''}`}
                onClick={() => setSelectedTab('aboutMe')}
              >
                За мен
              </button>
            </li>
            {additionalTabs.map((tab) => (
              <li key={tab.key} className="nav-item tabs-lg-block">
                <button
                  type="button"
                  className={`nav-link ${selectedTab === tab.key ? 'active' : ''}`}
                  onClick={() => setSelectedTab(tab.key as UserTab)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
            <li className="nav-item dropdown dropdown-lg-none">
              <button
                type="button"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Повече
              </button>
              <ul className="dropdown-menu">
                {additionalTabs.map((tab) => (
                  <li key={tab.key}>
                    <button type="button" className="dropdown-item" onClick={() => setSelectedTab(tab.key as UserTab)}>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className="tab-content p-2">{renderTabContent()}</div>
        </section>
      )}

      {showGallery && userView && (
        <div>
          <ImageGalleryModal
            items={[{ original: userView.userProfilePictureUrl }]}
            onCloseButtonClick={handleCloseGallery}
          />
        </div>
      )}
    </div>
  );
}
