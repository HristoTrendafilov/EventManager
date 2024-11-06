import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  getUserProfilePicture,
  getUserView,
} from '~Infrastructure/ApiRequests/users-requests';
import type { UserView } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import noUserLogo from '~asset/no-user-logo.png';

import './UserProfile.css';

export function UserProfile() {
  const [userView, setUserView] = useState<UserView | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [profilePicture, setProfilePicture] = useState<string>(noUserLogo);

  const { userId } = useParams();

  const fetchUserView = useCallback(async () => {
    const userViewResponse = await getUserView(Number(userId));
    if (!userViewResponse.success) {
      setError(userViewResponse.errorMessage);
      return;
    }

    setUserView(userViewResponse.data);

    if (userViewResponse.data.hasProfilePicture) {
      const profilePictureResponse = await getUserProfilePicture(
        Number(userId)
      );
      if (!profilePictureResponse.success) {
        setError(profilePictureResponse.errorMessage);
        return;
      }

      setProfilePicture(URL.createObjectURL(profilePictureResponse.data));
    }
  }, [userId]);

  useEffect(() => {
    void fetchUserView();
  }, [fetchUserView]);

  useEffect(
    () => () => {
      URL.revokeObjectURL(profilePicture);
    },
    [profilePicture]
  );

  return (
    <div className="user-profile-wrapper">
      <div className="container mt-3">
        {error && (
          <div className="card-footer">
            <ErrorMessage error={error} />
          </div>
        )}
        {userView && (
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img
                      className="profile-image"
                      src={profilePicture}
                      alt=""
                    />
                    <div className="mt-3">
                      <h4>{userView.username}</h4>
                      <p className="text-secondary mb-1">
                        {userView.shortDescription}
                      </p>
                      {userView.canEdit && (
                        <Link
                          to={`/users/${userId}/update`}
                          className="btn btn-primary w-100 mt-2"
                        >
                          Редакция
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Имена</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {userView.userFullName}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Имейл</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {userView.email}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Телефон</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {userView.phoneNumber}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Живея в</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {userView.regionName}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Помагам в</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {userView.regionsHelping
                        .map((list) => list.regionName)
                        .join(' | ')}
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
