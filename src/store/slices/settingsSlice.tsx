 import { Setting } from '@/interfaces/models';
import { createSlice } from '@reduxjs/toolkit';

export type SettingsState = {
  data: Setting[] | null;
};

const initialState: SettingsState = {
  data: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action) => {
      state.data = action.payload;

    },
  },
});

export const { setSettings  } = settingsSlice.actions;

export default settingsSlice.reducer;