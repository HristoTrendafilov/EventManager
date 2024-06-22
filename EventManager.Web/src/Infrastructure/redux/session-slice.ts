import { createSlice } from '@reduxjs/toolkit';

import { loginUser, logoutUser } from '~Infrastructure/api-requests';
import type { UserLoginDto } from '~User/Login/Login';

import type { ApplicationState } from './store';
import { createAppAsyncThunk } from './store-utils';

export interface UserState {
  userId: number;
  username: string;
  token: string;
  webSessionId: number;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isEventCreator: boolean;
}

export interface SessionState {
  user: UserState;
  loginUserLoading: boolean;
  logoutUserLoading: boolean;
}

const initialUserState: UserState = {
  userId: 0,
  username: '',
  token: '',
  webSessionId: 0,
  isLoggedIn: false,
  isAdmin: false,
  isEventCreator: false,
};

const initialSessionState: SessionState = {
  user: initialUserState,
  loginUserLoading: false,
  logoutUserLoading: false,
};

export type UserRole = 'None' | 'Admin' | 'EventCreator';
export const UserRoleMap = new Map<number, UserRole>([
  [0, 'None'],
  [1, 'Admin'],
  [2, 'EventCreator'],
]);

const localStorageKey = '0831acb9-da5e-47bf-9fb3-92194225e112';

function getInitialState(): SessionState {
  const storageUserState = localStorage.getItem(localStorageKey);
  const userState = storageUserState
    ? (JSON.parse(storageUserState) as UserState)
    : initialUserState;

  const sessionState = initialSessionState;
  sessionState.user = userState;

  return sessionState;
}

export const loginUserThunk = createAppAsyncThunk(
  'session/login',
  async (request: UserLoginDto) => {
    const user = await loginUser(request);
    return user;
  }
);

export const logoutUserThunk = createAppAsyncThunk(
  'session/logout',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    await logoutUser({ webSessionId: state.session.user.webSessionId });
  }
);

export const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    // loginUserThunk
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.user = action.payload;
      state.user.isLoggedIn = true;

      window.userToken = action.payload.token;

      state.loginUserLoading = false;
    });
    builder.addCase(loginUserThunk.pending, (state) => {
      state.loginUserLoading = true;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.loginUserLoading = false;
    });

    // logoutUserThunk
    builder.addCase(logoutUserThunk.fulfilled, () => {
      window.userToken = undefined;
      return initialSessionState;
    });
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.logoutUserLoading = true;
    });
    builder.addCase(logoutUserThunk.rejected, (state) => {
      state.logoutUserLoading = false;
    });
  },
});

export const sessionSelector = (state: ApplicationState) => state.session;
