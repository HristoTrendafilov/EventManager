import {
  faCirclePlus,
  faHome,
  faMagnifyingGlass,
  faPeopleRoof,
  faUser,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '~/Infrastructure/ApiRequests/users-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import { ErrorModal } from '~/Infrastructure/components/ErrorModal/ErrorModal';
import { useAppDispatch } from '~/Infrastructure/redux/store';
import {
  type UserState,
  removeUser,
  userSelector,
} from '~/Infrastructure/redux/user-slice';
import noUserLogo from '~/asset/no-user-logo.png';

import './Navbar.css';

interface NavUserDropdownProps {
  user: UserState;
  loading: boolean;
  handleLogout: () => void;
  handleNavClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

function NavUserDropdown(props: NavUserDropdownProps) {
  const { user, loading, handleLogout, handleNavClick } = props;

  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle profile-picture-dropdown"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="User profile dropdown"
      >
        <img
          height={45}
          width={45}
          className="rounded-circle"
          src={
            user.profilePicture
              ? `data:image/jpeg;base64,${user.profilePicture}`
              : noUserLogo
          }
          alt=""
        />
      </button>
      <ul className="dropdown-menu dropdown-menu-end p-2">
        <li className="mb-1">
          <Link
            to={CustomRoutes.usersView(user.userId)}
            onClick={handleNavClick}
            className="unset-anchor"
          >
            <div className="d-flex align-items-center">
              <FontAwesomeIcon
                className="me-2 fa-fw fa-border"
                size="lg"
                icon={faUser}
              />
              <span>Към профила</span>
            </div>
          </Link>
        </li>
        {(user.isAdmin || user.isEventCreator) && (
          <li className="mb-1">
            <Link
              className="unset-anchor"
              to={CustomRoutes.eventsNew()}
              onClick={handleNavClick}
            >
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  className="me-2 fa-fw fa-border"
                  color="green"
                  size="lg"
                  icon={faCirclePlus}
                />
                <span>Създай събитие</span>
              </div>
            </Link>
          </li>
        )}
        {user.isAdmin && (
          <li className="mb-1">
            <Link
              className="unset-anchor"
              to={CustomRoutes.usersAdminPanel()}
              onClick={handleNavClick}
            >
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  className="me-2 fa-fw fa-border"
                  color="blue"
                  size="lg"
                  icon={faUserTie}
                />
                <span>Админ панел</span>
              </div>
            </Link>
          </li>
        )}
        <hr className="m-2" />
        <li>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="btn btn-sm btn-danger w-100"
          >
            Изход
          </button>
        </li>
      </ul>
    </div>
  );
}

export function Navbar() {
  const user = useSelector(userSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const path = event.currentTarget.getAttribute('href');

      if (path) {
        navigate(path);
      }
    },
    [navigate]
  );

  const handleLogout = useCallback(async () => {
    setLogoutLoading(true);

    const response = await logoutUser();
    if (!response.success) {
      setError(response.errorMessage);
      setLogoutLoading(false);
      return;
    }

    dispatch(removeUser());
    navigate('/');
    setLogoutLoading(false);
  }, [dispatch, navigate]);

  return (
    <nav className="navbar fixed-top navbar-expand-md px-md-5">
      <div className="container-fluid">
        <button
          id="offcanvasBtn"
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="offcanvas"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <Link className="navbar-brand me-auto" to="/">
          ihelp
        </Link>

        <div className="d-flex gap-2 order-0 order-md-1">
          {!user.isLoggedIn ? (
            <Link to={CustomRoutes.usersLogin()} className="btn btn-warning">
              Вход
            </Link>
          ) : (
            <NavUserDropdown
              user={user}
              loading={logoutLoading}
              handleLogout={handleLogout}
              handleNavClick={handleLinkClick}
            />
          )}
        </div>

        <div
          className="offcanvas offcanvas-start order-0"
          tabIndex={-1}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header pb-2">
            <h3 className="offcanvas-title" id="offcanvasNavbarLabel">
              ihelp
            </h3>

            <button
              type="button"
              className="btn-close bg-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          <hr className="d-md-none mt-1" />
          <div className="offcanvas-body ms-md-3 pt-0">
            <ul className="navbar-nav flex-grow-1 pe-3">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  data-bs-dismiss="offcanvas"
                  onClick={handleLinkClick}
                >
                  <div className="d-flex flex-md-column align-items-center">
                    <FontAwesomeIcon
                      className="me-3 me-md-0 fa-fw"
                      size="lg"
                      icon={faHome}
                    />
                    <span>Начало</span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={CustomRoutes.eventsSearchBase()}
                  data-bs-dismiss="offcanvas"
                  onClick={handleLinkClick}
                >
                  <div className="d-flex flex-md-column align-items-center">
                    <FontAwesomeIcon
                      className="me-3 me-md-0 fa-fw"
                      size="lg"
                      icon={faMagnifyingGlass}
                    />
                    <span>Събития</span>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={CustomRoutes.aboutUs()}
                  data-bs-dismiss="offcanvas"
                  onClick={handleLinkClick}
                >
                  <div className="d-flex flex-md-column align-items-center">
                    <FontAwesomeIcon
                      className="me-3 me-md-0 fa-fw"
                      size="lg"
                      icon={faPeopleRoof}
                    />
                    <span> За нас</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {error && (
        <ErrorModal error={error} onClose={() => setError(undefined)} />
      )}
    </nav>
  );
}
