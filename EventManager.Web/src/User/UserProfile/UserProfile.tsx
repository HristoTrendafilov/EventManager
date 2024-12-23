import { faEnvelope, faHouse, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import {
  getUserProfileEvents,
  getUserProfileOrganizations,
  getUserView,
} from '~/Infrastructure/ApiRequests/users-requests';
import { useScrollPosition } from '~/Infrastructure/CustomHooks/useScrollPosition';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { UserProfileEvent, UserProfileOrganization, UserView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { ImageGalleryModal } from '~/Infrastructure/components/ImageGalleryModal/ImageGalleryModal';
import { UserProfileEventType, UserProfileOrganizationType } from '~/User/user-utils';

import { ProfileAboutMe } from './ProfileAboutMe';
import { ProfileEvents } from './ProfileEvents';
import { ProfileOrganizations } from './ProfileOrganizations';

import './UserProfile.css';

export type UserTab = 'aboutMe' | 'organization' | 'events';

interface UserAdditionalTab {
  key: UserTab;
  label: string;
}

export interface UserEventsOptions {
  events: UserProfileEvent[];
  type: string;
  error: string | undefined;
  loading: boolean;
}

export interface UserOrganizationsOptions {
  organizations: UserProfileOrganization[];
  type: string;
  error: string | undefined;
  loading: boolean;
}

export function UserProfile() {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { saveScrollPosition, restoreScrollPosition } = useScrollPosition();

  const [userView, setUserView] = useState<UserView | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [gallery, setGallery] = useState<boolean>(false);

  // Get the selected tab from the URL query parameter (default to 'aboutMe')
  const selectedTab = (searchParams.get('tab') as UserTab) || 'aboutMe';
  const selectedType = searchParams.get('type');

  const [eventsOptions, setEventsOptions] = useState<UserEventsOptions>({
    events: [],
    type: selectedType || UserProfileEventType.Subscriptions.toString(),
    error: undefined,
    loading: false,
  });

  const [organizationsOptions, setOrganizationsOptions] = useState<UserOrganizationsOptions>({
    organizations: [],
    type: selectedType || UserProfileOrganizationType.Subscriptions.toString(),
    error: undefined,
    loading: false,
  });

  const loadUserView = useCallback(async () => {
    const userViewResponse = await getUserView(Number(userId));
    if (!userViewResponse.success) {
      setError(userViewResponse.errorMessage);
      return;
    }

    setUserView(userViewResponse.data);
  }, [userId]);

  const showGallery = useCallback(() => {
    setGallery(true);
  }, []);

  const closeGallery = useCallback(() => {
    setGallery(false);
  }, []);

  const handleTabChange = useCallback(
    (tab: UserTab) => {
      // Create the newParams object with the correct type
      const newParams: { tab: UserTab; type?: string } = { tab };

      // Conditionally add the 'type' property if tab is 'events' or 'organization'
      if (tab === 'events') {
        newParams.type = eventsOptions.type;
      } else if (tab === 'organization') {
        newParams.type = organizationsOptions.type;
      }

      // Update the search parameters
      setSearchParams(newParams);
    },
    [setSearchParams, eventsOptions.type, organizationsOptions.type]
  );

  const handleEventTypeChange = useCallback(
    async (type: string) => {
      setEventsOptions((prevOptions) => ({ ...prevOptions, error: undefined, loading: true }));

      const response = await getUserProfileEvents(Number(userId), Number.parseInt(type, 10) as UserProfileEventType);
      if (!response.success) {
        setEventsOptions((prevOptions) => ({ ...prevOptions, error: response.errorMessage, loading: false }));
        return;
      }

      setSearchParams({ tab: selectedTab, type });
      setEventsOptions({ events: response.data, type: type.toString(), error: undefined, loading: false });
      restoreScrollPosition();
    },
    [restoreScrollPosition, selectedTab, setSearchParams, userId]
  );

  const handleOrganizationTypeChange = useCallback(
    async (type: string) => {
      setOrganizationsOptions((prevOptions) => ({ ...prevOptions, error: undefined, loading: true }));

      const response = await getUserProfileOrganizations(
        Number(userId),
        Number.parseInt(type, 10) as UserProfileOrganizationType
      );
      if (!response.success) {
        setOrganizationsOptions((prevOptions) => ({ ...prevOptions, error: response.errorMessage, loading: false }));
        return;
      }

      setSearchParams({ tab: selectedTab, type });
      setOrganizationsOptions({
        organizations: response.data,
        type: type.toString(),
        error: undefined,
        loading: false,
      });
      restoreScrollPosition();
    },
    [restoreScrollPosition, selectedTab, setSearchParams, userId]
  );

  const renderTabContent = useCallback(() => {
    switch (selectedTab) {
      case 'aboutMe':
        return <ProfileAboutMe user={userView!} />;
      case 'organization':
        return (
          <ProfileOrganizations
            userIsOrganizationManager={userView?.isOrganizationManager || false}
            options={organizationsOptions}
            saveScrollPosition={saveScrollPosition}
            onInputChange={handleOrganizationTypeChange}
          />
        );
      case 'events':
        return (
          <ProfileEvents
            userIsEventManager={userView?.isEventManager || false}
            options={eventsOptions}
            saveScrollPosition={saveScrollPosition}
            onInputChange={handleEventTypeChange}
          />
        );
      default:
        return null;
    }
  }, [
    eventsOptions,
    handleEventTypeChange,
    handleOrganizationTypeChange,
    organizationsOptions,
    saveScrollPosition,
    selectedTab,
    userView,
  ]);

  const additionalTabs: UserAdditionalTab[] = [
    { key: 'events', label: 'Събития' },
    { key: 'organization', label: 'Организации' },
  ];

  useEffect(() => {
    void loadUserView();
  }, [loadUserView]);

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
                      onClick={showGallery}
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
                onClick={() => handleTabChange('aboutMe')}
              >
                За мен
              </button>
            </li>
            {additionalTabs.map((tab) => (
              <li key={tab.key} className="nav-item tabs-lg-block">
                <button
                  type="button"
                  className={`nav-link ${selectedTab === tab.key ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.key)}
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
                    <button type="button" className="dropdown-item" onClick={() => handleTabChange(tab.key)}>
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

      {gallery && userView && (
        <ImageGalleryModal items={[{ original: userView.userProfilePictureUrl }]} onCloseButtonClick={closeGallery} />
      )}
    </div>
  );
}
