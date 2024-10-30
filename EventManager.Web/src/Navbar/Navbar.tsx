import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '~Infrastructure/ApiRequests/users-requests';
import { ErrorModal } from '~Infrastructure/components/ErrorModal/ErrorModal';
import { useAppDispatch } from '~Infrastructure/redux/store';
import {
  type UserState,
  removeUser,
  userSelector,
} from '~Infrastructure/redux/user-slice';

import './Navbar.css';

interface NavUserDropdownProps {
  user: UserState;
  loading: boolean;
  isInOffcanvas: boolean;
  handleLogout: () => void;
  handleNavClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

function NavUserDropdown(props: NavUserDropdownProps) {
  const { user, loading, isInOffcanvas, handleLogout, handleNavClick } = props;

  return (
    <div className={`dropdown ${!isInOffcanvas && 'd-none d-md-flex'}`}>
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {user.username}
      </button>
      <ul className="dropdown-menu dropdown-menu-start dropdown-menu-md-end p-2">
        <li>
          <Link
            to={`/users/${user.userId}/view`}
            data-bs-dismiss={`${isInOffcanvas ? 'offcanvas' : 'none'}`}
            onClick={handleNavClick}
          >
            Към профила
          </Link>
        </li>
        {(user.isAdmin || user.isEventCreator) && (
          <li>
            <Link
              to="/events/new"
              data-bs-dismiss={`${isInOffcanvas ? 'offcanvas' : 'none'}`}
              onClick={handleNavClick}
            >
              Създай събитие
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
    <nav className="navbar bg-light sticky-top navbar-expand-md">
      <div className="container-fluid">
        <button
          id="offcanvasBtn"
          className="navbar-toggler me-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="offcanvas"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <Link className="navbar-brand me-auto" to="/">
          EventManager
        </Link>

        <div className="d-flex gap-2 order-0 order-md-1">
          {!user.isLoggedIn ? (
            <Link to="users/login" className="btn btn-warning">
              Вход
            </Link>
          ) : (
            <NavUserDropdown
              user={user}
              loading={logoutLoading}
              isInOffcanvas={false}
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
          <div className="offcanvas-header pb-0">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              {user.isLoggedIn ? (
                <NavUserDropdown
                  user={user}
                  loading={logoutLoading}
                  isInOffcanvas
                  handleLogout={handleLogout}
                  handleNavClick={handleLinkClick}
                />
              ) : (
                <div>EventManager</div>
              )}
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          <hr className="d-md-none mt-1" />
          <div className="offcanvas-body pt-0">
            <ul className="navbar-nav flex-grow-1 pe-3">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  data-bs-dismiss="offcanvas"
                  onClick={handleLinkClick}
                >
                  Начало
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/events/search/1"
                  data-bs-dismiss="offcanvas"
                  onClick={handleLinkClick}
                >
                  Събития
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
