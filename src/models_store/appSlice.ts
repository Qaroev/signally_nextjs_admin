import { createSlice } from '@reduxjs/toolkit';

interface IState {
  openDrawer: boolean;
}

const State = {
  openDrawer: false
} as IState;

const appSlice = createSlice({
  name: 'appSlice',
  initialState: State,

  reducers: {
    toggleDrawer: (state) => {
      state.openDrawer = !state.openDrawer;
    },
    setCloseDrawer: (state) => {
      state.openDrawer = false;
    },
    setOpenDrawer: (state) => {
      state.openDrawer = true;
    }
  }
});

export const { toggleDrawer, setCloseDrawer, setOpenDrawer } = appSlice.actions;

export default appSlice.reducer;
