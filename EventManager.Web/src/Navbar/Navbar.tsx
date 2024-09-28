import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '~Infrastructure/api-requests';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { useAppDispatch } from '~Infrastructure/redux/store';
import { removeUser, userSelector } from '~Infrastructure/redux/user-slice';
import { getClientErrorMessage } from '~Infrastructure/utils';

import './Navbar.css';

export function Navbar() {
  const user = useSelector(userSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const offcanvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.innerWidth >= 767) {
      return undefined;
    }

    const offcanvasElement = offcanvasRef.current;
    if (!offcanvasElement) {
      return undefined;
    }

    const closeOffcanvas = () => {
      document.body.removeAttribute('style');

      const btn = document.getElementById('offcanvasBtn');
      btn?.click();
    };

    // Select all <a> and <button> elements within the offcanvas
    const anchorAndButtons = offcanvasElement.querySelectorAll('a, button');

    // Add event listeners to close the offcanvas on click
    anchorAndButtons.forEach((element) => {
      element.addEventListener('click', closeOffcanvas);
    });

    return () => {
      anchorAndButtons.forEach((element) => {
        element.removeEventListener('click', closeOffcanvas);
      });
    };
  }, []);

  const handleLogout = useCallback(async () => {
    setLogoutLoading(true);

    try {
      await logoutUser({ webSessionId: user.webSessionId });
      dispatch(removeUser());
      navigate('/');
    } catch (err) {
      setError(getClientErrorMessage(err));
    } finally {
      setLogoutLoading(false);
    }
  }, [dispatch, navigate, user.webSessionId]);

  return (
    <nav className="navbar bg-light sticky-top navbar-expand-md">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          EventManager
        </a>
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
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          ref={offcanvasRef}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header pb-0">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              {user.isLoggedIn ? (
                <Link to={`/user/${user.userId}/profile`}>{user.username}</Link>
              ) : (
                <div>EventManager</div>
              )}
            </h5>

            <button type="button" className="btn-close" aria-label="Close" />
          </div>
          <div className="gap-4 p-1 d-md-none d-flex">
            {!user.isLoggedIn && (
              <>
                <Link to="/register" className="btn btn-sm btn-warning w-100">
                  Регистрация
                </Link>
                <Link to="/login" className="btn btn-sm btn-warning w-100">
                  Вход
                </Link>
              </>
            )}
          </div>
          <hr className="d-md-none mt-1" />
          <div className="offcanvas-body pt-0">
            <ul className="navbar-nav flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Начало
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/events/list">
                  Събития
                </Link>
              </li>
            </ul>
            {user.isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="btn btn-danger w-100 d-md-none"
              >
                Изход
              </button>
            )}
            <div className="gap-4 justify-content-end d-none d-md-flex">
              {user.isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="btn btn-danger"
                >
                  Изход
                </button>
              ) : (
                <>
                  <Link to="/register" className="btn btn-warning w-100">
                    Регистрация
                  </Link>
                  <Link to="/login" className="btn btn-warning w-100">
                    Вход
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {error && <ErrorMessage error={error} />}
    </nav>
  );
}
