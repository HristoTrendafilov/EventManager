import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { userReducer } from './user-slice';

const rootReducer = combineReducers({
  user: userReducer,
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export function createStore(preloadedState?: Partial<ApplicationState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return store;
}

export type Store = ReturnType<typeof createStore>;

export type ApplicationDispatch = Store['dispatch'];

export const useAppDispatch: () => ApplicationDispatch = useDispatch;

export const store = createStore();
