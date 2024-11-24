import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faList, faLocation, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';

interface AdminPanelNav {
  location: string;
  name: string;
  icon: IconProp;
  color: string;
}

const navigation: AdminPanelNav[] = [
  {
    location: CustomRoutes.usersAdminPanelRegions(),
    name: 'Региони',
    icon: faLocation,
    color: 'success',
  },
  {
    location: CustomRoutes.usersAdminPanelCrudLogs(),
    name: 'Логове',
    icon: faList,
    color: 'warning',
  },
  {
    location: CustomRoutes.usersAdminPanelUserRoles(),
    name: 'Потребителски права',
    icon: faUser,
    color: 'primary',
  },
];

export function AdminPanel() {
  return (
    <div className="admin-panel-wrapper mt-4">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card">
          <div className="card-body">
            <div className="row g-2">
              {navigation.map((x) => (
                <div key={x.location} className="col-md-6">
                  <Link to={x.location} className="card unset-anchor">
                    <div
                      className={`card-body d-flex border border-black bg-${x.color} flex-wrap flex-column justify-content-center align-content-center`}
                    >
                      <FontAwesomeIcon color="white" icon={x.icon} size="4x" />
                      <div className="text-white fw-medium">{x.name}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
