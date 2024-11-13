import { Fragment, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Home } from '~Home/Home';
import { type UserState, userSelector } from '~Infrastructure/redux/user-slice';

import { type RouteTable, routes } from './routes';

function canUserAccessComponent(
  routeTable: RouteTable,
  user: UserState
): boolean {
  if (routeTable.location === 'users/login' && user.isLoggedIn) {
    return false;
  }
  if (routeTable.location === 'users/register' && user.isLoggedIn) {
    return false;
  }

  if (routeTable.requiresLogin && !user.isLoggedIn) {
    return false;
  }

  if (user.isAdmin) {
    return true;
  }

  if (routeTable.role === 'EventCreator' && !user.isEventCreator) {
    return false;
  }

  return true;
}

interface UserAccessBoundaryProps {
  routeTable: RouteTable;
  children: ReactNode;
}

function UserAccessBoundary(props: UserAccessBoundaryProps) {
  const { routeTable, children } = props;

  const user = useSelector(userSelector);

  if (canUserAccessComponent(routeTable, user)) {
    return children;
  }

  return <Navigate to="/" />;
}

export function RenderRouteTable() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {routes.map((route) => (
        <Route
          key={route.location}
          path={route.location}
          element={
            <UserAccessBoundary routeTable={route}>
              <Fragment key={uuidv4()}>{route.component}</Fragment>
            </UserAccessBoundary>
          }
        />
      ))}
    </Routes>
  );
}
