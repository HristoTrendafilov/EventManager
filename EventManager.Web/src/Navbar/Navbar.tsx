import {
  faFacebook,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import {
  logoutUserThunk,
  sessionSelector,
} from '~Infrastructure/redux/session-slice';
import { useAppDispatch } from '~Infrastructure/redux/store';
import { getClientErrorMessage } from '~Infrastructure/utils';
import logo from '~asset/project-logo.png';

import './Navbar.css';

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, logoutUserLoading } = useSelector(sessionSelector);
  const [error, setError] = useState<string>();

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      navigate('/');
    } catch (err) {
      setError(getClientErrorMessage(err));
    }
  }, [dispatch, navigate]);

  return (
    <>
      <nav className="navbar navbar-expand-md white">
        <div className="container-fluid navbar-top flex-nowrap">
          <Link className="navbar-brand" to="/">
            <img className="navbar-brand-logo" src={logo} alt="..." />
          </Link>

          <div className="social-networks">
            <div className="navbar-social-networks-header">
              Посетете ни в социалните мрежи
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <FontAwesomeIcon
                className="navbar-social-network-icon"
                icon={faFacebook}
                color="blue"
                size="2x"
              />
              <FontAwesomeIcon
                className="navbar-social-network-icon"
                icon={faInstagram}
                color="red"
                size="2x"
              />
              <FontAwesomeIcon
                className="navbar-social-network-icon"
                icon={faLinkedin}
                color="blue"
                size="2x"
              />
            </div>
          </div>
        </div>
      </nav>

      <nav className="navbar navbar-expand-sm bg-danger bg-gradient sticky-top px-sm-2">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="order-sm-last">
            {user.isLoggedIn ? (
              <div className="nav-logged-actions">
                <button
                  type="button"
                  className="nav-link dropdown-toggle text-white"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.username}
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <Link
                      className="nav-link"
                      to={`/user/profile/${user.userId}`}
                    >
                      Профил
                    </Link>
                  </li>
                  {user.isAdmin && (
                    <li>
                      <Link className="nav-link" to="/admin-panel">
                        Админ панел
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutUserLoading}
                  >
                    Изход
                  </button>
                </ul>
              </div>
            ) : (
              <div className="navbar-logout-actions">
                <Link
                  to="/register"
                  className="nav-link navbar-logout-actions-btn"
                >
                  Регистрация
                </Link>
                <Link
                  to="/login"
                  className="nav-link navbar-logout-actions-btn"
                >
                  Вход
                </Link>
              </div>
            )}
          </div>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link text-white" to="/">
                Начало
              </Link>

              {(user.isEventCreator || user.isAdmin) && (
                <Link className="nav-link text-white" to="/event/new">
                  Създай събитие
                </Link>
              )}
              <Link className="nav-link text-white" to="/events/page/1">
                Събития
              </Link>
            </div>
          </div>
        </div>
        {error && <ErrorMessage error={error} />}
      </nav>
    </>
  );
}
