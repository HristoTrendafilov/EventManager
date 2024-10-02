import React from 'react';

import { Event } from '~Event/Event';
import type { UserRole } from '~Infrastructure/redux/user-slice';
import { Login } from '~User/Login/Login';
import { Register } from '~User/Register/Register';

export interface RouteTable {
  location: string;
  component: React.JSX.Element;
  requiresLogin: boolean;
  role: UserRole;
}

export const routes: RouteTable[] = [
  {
    location: '/login',
    component: <Login />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: '/register',
    component: <Register />,
    requiresLogin: false,
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
