import React from 'react';

import { Event } from '~Event/Event';
import type { UserRole } from '~Infrastructure/redux/user-slice';
import { Login } from '~User/Login/Login';
import { UserProfile } from '~User/Profile/UserProfile';
import { Register } from '~User/Register/Register';
import { UserUpdate } from '~User/Update/UserUpdate';

export interface RouteTable {
  location: string;
  component: React.JSX.Element;
  requiresLogin: boolean;
  role: UserRole;
}

export const routes: RouteTable[] = [
  {
    location: 'users/login',
    component: <Login />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: 'users/register',
    component: <Register />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: 'users/:userId/view',
    component: <UserProfile />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: 'users/:userId/edit',
    component: <UserUpdate />,
    requiresLogin: true,
    role: 'None',
  },
  {
    location: '/events/new',
    component: <Event />,
    requiresLogin: true,
    role: 'EventCreator',
  },
  {
    location: '/events/:eventId/edit',
    component: <Event />,
    requiresLogin: true,
    role: 'EventCreator',
  },
];
