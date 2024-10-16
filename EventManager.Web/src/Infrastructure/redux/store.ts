import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { navigationSlice } from './navigate-slice';
import { userSlice } from './user-slice';

export const store = configureStore({
  reducer: {
    [userSlice.name]: userSlice.reducer,
    [navigationSlice.name]: navigationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type Store = typeof store;
export type ApplicationState = ReturnType<Store['getState']>;
export type ApplicationDispatch = Store['dispatch'];

export const useAppDispatch: () => ApplicationDispatch = useDispatch;
