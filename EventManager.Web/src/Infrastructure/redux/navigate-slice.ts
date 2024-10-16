import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface NavigationState {
  navigate: ((path: string) => void) | null;
}

const initialState: NavigationState = {
  navigate: null,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setNavigate: (state, action: PayloadAction<(path: string) => void>) => {
      state.navigate = action.payload;
    },
  },
});

export const { setNavigate } = navigationSlice.actions;
