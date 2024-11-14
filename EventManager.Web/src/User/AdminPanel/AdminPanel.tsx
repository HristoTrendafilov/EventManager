import { faList, faLocation, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import './AdminPanel.css';

export function AdminPanel() {
  return (
    <div className="admin-panel-wrapper mt-4">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <Link
                  to="/users/admin-panel/regions"
                  className="card unset-anchor"
                >
                  <div className="card-body d-flex border border-black bg-primary flex-wrap flex-column justify-content-center align-content-center">
                    <FontAwesomeIcon
                      color="white"
                      icon={faLocation}
                      size="4x"
                    />
                    <div className="text-white fw-medium">Региони</div>
                  </div>
                </Link>
              </div>
              <div className="col-md-6">
                <Link
                  to="/users/admin-panel/action-logs"
                  className="card unset-anchor"
                >
                  <div className="card-body border border-black d-flex bg-warning flex-wrap flex-column justify-content-center align-content-center">
                    <FontAwesomeIcon color="white" icon={faList} size="4x" />
                    <div className="text-white fw-medium">Логове</div>
                  </div>
                </Link>
              </div>
              <div className="col-md-6">
                <Link
                  to="/users/admin-panel/user-roles"
                  className="card unset-anchor"
                >
                  <div className="card-body border border-black d-flex bg-success flex-wrap flex-column justify-content-center align-content-center">
                    <FontAwesomeIcon color="white" icon={faUser} size="4x" />
                    <div className="text-white fw-medium">
                      Потребителски права
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
