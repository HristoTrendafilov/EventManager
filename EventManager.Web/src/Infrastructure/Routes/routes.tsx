import React from 'react';

import { AboutUs } from '~/AboutUs/AboutUs';
import { Event } from '~/Event/EventForm';
import { EventSearch } from '~/Event/EventSearch/EventSearch';
import { EventViewComponent } from '~/Event/EventView/EventView';
import type { UserRole } from '~/Infrastructure/redux/user-slice';
import { AdminPanel } from '~/User/AdminPanel/AdminPanel';
import { CrudLogs } from '~/User/AdminPanel/CrudLogs';
import { RegionsCatalog } from '~/User/AdminPanel/RegionsCatalog';
import { UsersRolesCatalog } from '~/User/AdminPanel/UsersRolesCatalog';
import { EmailVerification } from '~/User/EmailVerification';
import { Login } from '~/User/Login';
import { Register } from '~/User/Register';
import { UserProfile } from '~/User/UserProfile';
import { UserUpdate } from '~/User/UserUpdate/UserUpdate';

import { CustomRoutes } from './CustomRoutes';

export interface RouteTable {
  key?: string;
  location: string;
  component: React.JSX.Element;
  requiresLogin: boolean;
  role: UserRole;
}

export const table: RouteTable[] = [
  {
    location: CustomRoutes.usersLogin(),
    component: <Login />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: CustomRoutes.usersRegister(),
    component: <Register />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: CustomRoutes.usersAdminPanel(),
    component: <AdminPanel />,
    requiresLogin: true,
    role: 'Admin',
  },
  {
    location: CustomRoutes.usersAdminPanelRegions(),
    component: <RegionsCatalog />,
    requiresLogin: true,
    role: 'Admin',
  },
  {
    location: CustomRoutes.usersAdminPanelCrudLogs(),
    component: <CrudLogs />,
    requiresLogin: true,
    role: 'Admin',
  },
  {
    location: CustomRoutes.usersAdminPanelUserRoles(),
    component: <UsersRolesCatalog />,
    requiresLogin: true,
    role: 'Admin',
  },
  {
    location: CustomRoutes.usersView(),
    component: <UserProfile />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: CustomRoutes.usersUpdate(),
    component: <UserUpdate />,
    requiresLogin: true,
    role: 'None',
  },
  {
    location: CustomRoutes.usersEmailVerification(),
    component: <EmailVerification />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: CustomRoutes.eventsNew(),
    component: <Event />,
    requiresLogin: true,
    role: 'EventCreator',
  },
  {
    location: CustomRoutes.eventsUpdate(),
    component: <Event />,
    requiresLogin: true,
    role: 'EventCreator',
  },
  {
    location: CustomRoutes.eventsView(),
    component: <EventViewComponent />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: CustomRoutes.eventsSearchPage(),
    component: <EventSearch />,
    requiresLogin: false,
    role: 'None',
  },
  {
    location: CustomRoutes.aboutUs(),
    component: <AboutUs />,
    requiresLogin: false,
    role: 'None',
  },
];
