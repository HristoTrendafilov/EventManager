import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { sessionSlice } from './session-slice';

export function createStore(preloadedState: unknown) {
  const store = configureStore({
    reducer: {
      [sessionSlice.name]: sessionSlice.reducer,
    },
    preloadedState,
  });

  return store;
}

export type Store = ReturnType<typeof createStore>;
export type ApplicationState = ReturnType<Store['getState']>;
export type ApplicationDispatch = Store['dispatch'];

export const useAppDispatch: () => ApplicationDispatch = useDispatch;

export function createStoreWithState(state: Partial<ApplicationState>) {
  return createStore(state);
}
