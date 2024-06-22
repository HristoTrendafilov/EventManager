import { createAsyncThunk } from '@reduxjs/toolkit';

import type { ApplicationDispatch, ApplicationState } from './store';

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: ApplicationState;
  dispatch: ApplicationDispatch;
}>();
