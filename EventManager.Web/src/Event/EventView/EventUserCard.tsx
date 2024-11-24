import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getUserProfilePicture } from '~/Infrastructure/ApiRequests/users-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { UserEventView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { formatDateTime } from '~/Infrastructure/utils';
import noUserLogo from '~/asset/no-user-logo.png';

import './EventUserCard.css';

interface EventUserCardProps {
  user: UserEventView;
}

export function EventUserCard(props: EventUserCardProps) {
  const { user } = props;

  const [profilePicture, setProfilePicture] = useState<string>(noUserLogo);
  const [error, setError] = useState<string>();

  const loadProfilePicture = useCallback(async () => {
    const response = await getUserProfilePicture(user.userId!);
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setProfilePicture(URL.createObjectURL(response.data));
  }, [user.userId]);

  useEffect(() => {
    if (user.hasProfilePicture) {
      void loadProfilePicture();
    }
  }, [loadProfilePicture, user.hasProfilePicture]);

  useEffect(
    () => () => {
      URL.revokeObjectURL(profilePicture);
    },
    [profilePicture]
  );

  return (
    <Link
      to={CustomRoutes.usersView(user.userId!)}
      className="event-user-card-wrapper unset-anchor"
    >
      <div className="d-flex border border-1 align-items-center p-1">
        <img src={profilePicture} alt="profile" />
        <div className="d-flex flex-column ms-2">
          <div>{user.username}</div>
          <div className="fst-italic">
            {formatDateTime(user.userSubscribedOnDateTime!)}
          </div>
        </div>
      </div>
      {error && <ErrorMessage error={error} />}
    </Link>
  );
}
