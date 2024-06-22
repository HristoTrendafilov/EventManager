import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Home } from '~Home/Home';
import {
  type UserState,
  sessionSelector,
} from '~Infrastructure/redux/session-slice';

import { type RouteTable, routes } from './routes';

function canUserAccessComponent(
  routeTable: RouteTable,
  user: UserState
): boolean {
  if (routeTable.location === '/login' && user.isLoggedIn) {
    return false;
  }
  if (routeTable.location === '/register' && user.isLoggedIn) {
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

  const { user } = useSelector(sessionSelector);

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
              {route.component}
            </UserAccessBoundary>
          }
        />
      ))}
    </Routes>
  );
}
