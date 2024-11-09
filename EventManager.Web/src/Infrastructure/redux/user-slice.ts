import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { UserForWeb } from '~Infrastructure/api-types';

import type { ApplicationState } from './store';

export interface UserState {
  userId: number;
  username: string;
  webSessionId: number;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isEventCreator: boolean;
  token: string;
}

const initialUserState: UserState = {
  userId: 0,
  username: '',
  webSessionId: 0,
  isLoggedIn: false,
  isAdmin: false,
  isEventCreator: false,
  token: '',
};

export type UserRole = 'None' | 'Admin' | 'EventCreator';
export const UserRoleMap = new Map<number, UserRole>([
  [0, 'None'],
  [1, 'Admin'],
  [2, 'EventCreator'],
]);

const localStorageKey = '0831acb9-da5e-47bf-9fb3-92194225e112';

function getInitialState(): UserState {
  const storageUserState = localStorage.getItem(localStorageKey);
  const userState = storageUserState
    ? (JSON.parse(storageUserState) as UserState)
    : initialUserState;

  return userState;
}

export const userSlice = createSlice({
  name: 'user',
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action: PayloadAction<UserForWeb>) => {
      const { payload } = action;

      state.userId = payload.userId;
      state.username = payload.username;
      state.webSessionId = payload.webSessionId;
      state.isAdmin = payload.isAdmin;
      state.isEventCreator = payload.isEventCreator;
      state.isLoggedIn = true;
      state.token = payload.token;

      localStorage.setItem(localStorageKey, JSON.stringify(state));
    },
    removeUser: () => {
      localStorage.removeItem(localStorageKey);
      return initialUserState;
    },
    updateUsername: (state, action: PayloadAction<{ username: string }>) => {
      state.username = action.payload.username;
    },
  },
});

export const userSelector = (state: ApplicationState) => state.user;
export const { setUser, removeUser, updateUsername } = userSlice.actions;
