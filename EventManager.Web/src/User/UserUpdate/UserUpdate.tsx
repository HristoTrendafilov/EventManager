import { faGear, faShield, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  getUserProfilePicture,
  getUserView,
} from '~Infrastructure/ApiRequests/users-requests';
import type { UserView } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';

import { UserAccountSettings } from './AccountSettings';
import { UpdatePersonalData } from './UpdatePersonalData';
import { UserSecurity } from './UserSecurity';

import './UserUpdate.css';

const UserUpdateTabNames = {
  profile: 'Профил',
  settings: 'Настройки',
  security: 'Сигурност',
};

type UserUpdateTabName = keyof typeof UserUpdateTabNames;

export function UserUpdate() {
  const [activeTab, setActiveTab] = useState<UserUpdateTabName>('profile');
  const [error, setError] = useState<string | undefined>();
  const [user, setUser] = useState<UserView | undefined>();
  const [userProfilePicture, setUserProfilePicture] = useState<
    string | undefined
  >();

  const { userId } = useParams();

  const handleTabClick = useCallback((tab: UserUpdateTabName) => {
    setActiveTab(tab);
  }, []);

  const loadUser = useCallback(async () => {
    setError(undefined);

    const userResponse = await getUserView(Number(userId));
    if (!userResponse.success) {
      setError(userResponse.errorMessage);
      return;
    }

    setUser(userResponse.data);

    const profilePictureResponse = await getUserProfilePicture(Number(userId));
    if (!profilePictureResponse.success) {
      setError(profilePictureResponse.errorMessage);
      return;
    }

    setUserProfilePicture(URL.createObjectURL(profilePictureResponse.data));
  }, [userId]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return (
    <div className="user-update-wrapper mt-3">
      <div className="container">
        <div className="row gutters-sm">
          <div className="col-md-4 d-none d-md-block">
            <div className="card">
              <div className="card-body p-2">
                <nav className="nav flex-column ps-2">
                  <div className="nav-buttons">
                    <button
                      type="button"
                      className={`nav-button ${
                        activeTab === 'profile' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('profile')}
                    >
                      <FontAwesomeIcon
                        className="fa-fw me-2 fa-border"
                        icon={faUser}
                        size="xl"
                      />
                      {UserUpdateTabNames.profile}
                    </button>

                    <button
                      type="button"
                      className={`nav-button ${
                        activeTab === 'settings' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('settings')}
                    >
                      <FontAwesomeIcon
                        className="fa-fw me-2 fa-border"
                        icon={faGear}
                        size="xl"
                      />
                      {UserUpdateTabNames.settings}
                    </button>

                    <button
                      type="button"
                      className={`nav-button ${
                        activeTab === 'security' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('security')}
                    >
                      <FontAwesomeIcon
                        className="fa-fw me-2 fa-border"
                        icon={faShield}
                        size="xl"
                      />
                      {UserUpdateTabNames.security}
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-header  d-flex d-md-none">
                <ul className="nav nav-tabs card-header-tabs nav-gap-x-1">
                  <li className="nav-item">
                    <FontAwesomeIcon
                      className={`nav-link fs-2 ${
                        activeTab === 'profile' ? 'active' : ''
                      }`}
                      icon={faUser}
                      size="3x"
                      onClick={() => handleTabClick('profile')}
                    />
                  </li>
                  <li className="nav-item">
                    <FontAwesomeIcon
                      className={`nav-link fs-2 ${
                        activeTab === 'settings' ? 'active' : ''
                      }`}
                      icon={faGear}
                      size="3x"
                      onClick={() => handleTabClick('settings')}
                    />
                  </li>
                  <li className="nav-item">
                    <FontAwesomeIcon
                      className={`nav-link fs-2 ${
                        activeTab === 'security' ? 'active' : ''
                      }`}
                      icon={faShield}
                      size="3x"
                      onClick={() => handleTabClick('security')}
                    />
                  </li>
                </ul>
              </div>
              <div className="card-body tab-content">
                {user && activeTab === 'profile' && (
                  <UpdatePersonalData
                    user={user}
                    userId={Number(userId)}
                    userProfilePicture={userProfilePicture}
                  />
                )}
                {user && activeTab === 'settings' && (
                  <UserAccountSettings
                    userId={Number(userId)}
                    username={user.username}
                  />
                )}
                {activeTab === 'security' && (
                  <UserSecurity userId={Number(userId)} />
                )}
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="card-footer">
            <ErrorMessage error={error} />
          </div>
        )}
      </div>
    </div>
  );
}
