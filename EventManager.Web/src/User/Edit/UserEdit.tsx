import { faGear, faShield, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react'; // Import useState for managing active state

import './UserEdit.css';

const UserEditTabNames = {
  profile: 'Профил',
  settings: 'Настройки',
  security: 'Сигурност',
} as const;

type UserEditTabName = keyof typeof UserEditTabNames;

export function UserEdit() {
  const [activeTab, setActiveTab] = useState<UserEditTabName>('profile');

  const handleTabClick = (tab: UserEditTabName) => {
    setActiveTab(tab);
  };

  return (
    <div className="user-edit-wrapper mt-3">
      <div className="container">
        <div className="row gutters-sm">
          <div className="col-md-4 d-none d-md-block">
            <div className="card">
              <div className="card-body">
                <nav className="nav flex-column gap-2 ps-2">
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
                    {UserEditTabNames.profile}
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
                    {UserEditTabNames.settings}
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
                    {UserEditTabNames.security}
                  </button>
                </nav>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <ul className="nav nav-tabs d-md-none">
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
        </div>
      </div>
    </div>
  );
}
