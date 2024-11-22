import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Home } from '~Home/Home';
import { type UserState, userSelector } from '~Infrastructure/redux/user-slice';
import { NotFound } from '~NotFound/NotFound';

import { CustomRoutes } from './CustomRoutes';
import { type RouteTable, table } from './routes';

function canUserAccessComponent(
  routeTable: RouteTable,
  user: UserState
): boolean {
  if (routeTable.location === CustomRoutes.usersLogin() && user.isLoggedIn) {
    return false;
  }
  if (routeTable.location === CustomRoutes.usersRegister() && user.isLoggedIn) {
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
      <Route path="*" element={<NotFound />} />
      {table.map((x) => (
        <Route
          key={x.location}
          path={x.location}
          element={
            <UserAccessBoundary key={uuidv4()} routeTable={x}>
              {x.component}
            </UserAccessBoundary>
          }
        />
      ))}
    </Routes>
  );
}
