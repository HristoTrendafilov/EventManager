import React from 'react';

import { Event } from '~Event/EventForm';
import { EventSearch } from '~Event/EventSearch/EventSearch';
import { EventViewComponent } from '~Event/EventView/EventView';
import type { UserRole } from '~Infrastructure/redux/user-slice';
import { Login } from '~User/Login/Login';
import { Register } from '~User/Register/Register';
import { UserProfile } from '~User/UserProfile/UserProfile';
import { UserUpdate } from '~User/UserUpdate/UserUpdate';

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
    location: 'users/:userId/update',
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
    location: '/events/:eventId/update',
    component: <Event />,
    requiresLogin: true,
    role: 'EventCreator',
  },
  {
    location: '/events/:eventId/view',
    component: <EventViewComponent />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: '/events/search',
    component: <EventSearch />,
    requiresLogin: false,
    role: 'None',
  },
];
