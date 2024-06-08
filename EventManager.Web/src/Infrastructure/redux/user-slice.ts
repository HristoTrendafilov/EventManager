import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { ApplicationState } from './store';

export interface UserState {
  userId: number;
  username: string;
  token: string;
  userClaimsIds: number[];
  webSessionId: number;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isEventCreator: boolean;
}

const initialState: UserState = {
  userId: 0,
  username: '',
  token: '',
  userClaimsIds: [],
  webSessionId: 0,
  isLoggedIn: false,
  isAdmin: false,
  isEventCreator: false,
};

export type UserRole = 'None' | 'Admin' | 'EventCreator';
export const UserRoleMap = new Map<number, UserRole>([
  [0, 'None'],
  [1, 'Admin'],
  [2, 'EventCreator'],
]);

function getInitialState(): UserState {
  const state = localStorage.getItem('0831acb9-da5e-47bf-9fb3-92194225e112');
  return state ? (JSON.parse(state) as UserState) : initialState;
}

export const userSlice = createSlice({
  name: 'user',
  initialState: getInitialState(),
  reducers: {
    addUser: (_, action: PayloadAction<UserState>) => {
      localStorage.setItem(
        '0831acb9-da5e-47bf-9fb3-92194225e112',
        JSON.stringify(action.payload)
      );

      return action.payload;
    },
    removeUser: () => {
      localStorage.removeItem('0831acb9-da5e-47bf-9fb3-92194225e112');
      return initialState;
    },
  },
});

export const userSelector = (state: ApplicationState) => state.user;
export const userReducer = userSlice.reducer;

export const { addUser, removeUser } = userSlice.actions;
