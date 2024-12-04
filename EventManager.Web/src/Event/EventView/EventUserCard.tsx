import { Link } from 'react-router-dom';

import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { UserEventView } from '~/Infrastructure/api-types';
import { formatDateTime } from '~/Infrastructure/utils';

import './EventUserCard.css';

interface EventUserCardProps {
  user: UserEventView;
}

export function EventUserCard(props: EventUserCardProps) {
  const { user } = props;

  return (
    <Link
      to={CustomRoutes.usersView(user.userId)}
      className="event-user-card-wrapper unset-anchor"
    >
      <div className="d-flex border border-1 align-items-center p-1">
        <img src={user.userProfilePictureUrl} alt="profile" />
        <div className="d-flex flex-column ms-2">
          <div>{user.username}</div>
          <div className="fst-italic">
            {formatDateTime(user.userSubscribedOnDateTime)}
          </div>
        </div>
      </div>
    </Link>
  );
}
