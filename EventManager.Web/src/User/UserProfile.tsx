import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getUserView } from '~/Infrastructure/ApiRequests/users-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { UserView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { ImageGalleryModal } from '~/Infrastructure/components/ImageGalleryModal/ImageGalleryModal';

export function UserProfile() {
  const [userView, setUserView] = useState<UserView | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [showGallery, setShowGallery] = useState<boolean>(false);

  const { userId } = useParams();

  const fetchUserView = useCallback(async () => {
    const userViewResponse = await getUserView(Number(userId));
    if (!userViewResponse.success) {
      setError(userViewResponse.errorMessage);
      return;
    }

    setUserView(userViewResponse.data);
  }, [userId]);

  const handleShowGallery = useCallback(() => {
    setShowGallery(true);
  }, []);

  const handleCloseGallery = useCallback(() => {
    setShowGallery(false);
  }, []);

  useEffect(() => {
    void fetchUserView();
  }, [fetchUserView]);

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
                    <button
                      className="unset-btn d-flex justify-content-center"
                      type="button"
                      onClick={handleShowGallery}
                    >
                      <img
                        className="rounded-circle object-fit-cover"
                        height={200}
                        width={200}
                        src={userView.userProfilePictureUrl}
                        alt="profile"
                      />
                    </button>
                    <div className="mt-3">
                      <h4>{userView.username}</h4>
                      <p className="text-secondary mb-1 pre-wrap">{userView.userShortDescription}</p>
                      {userView.canEdit && (
                        <Link to={CustomRoutes.usersUpdate(Number(userId))} className="btn btn-primary w-200px">
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
                    <div className="col-sm-9 text-secondary">{userView.userFullName}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Имейл</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{userView.userEmail}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Телефон</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{userView.userPhoneNumber}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Живея в</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">{userView.regionName}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Помагам в</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {userView.regionsHelping.map((list) => list.regionName).join(' | ')}
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showGallery && userView && (
        <div>
          <ImageGalleryModal
            items={[{ original: userView.userProfilePictureUrl }]}
            onCloseButtonClick={handleCloseGallery}
          />
        </div>
      )}
    </div>
  );
}
