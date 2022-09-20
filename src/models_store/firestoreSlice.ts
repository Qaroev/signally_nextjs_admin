import { createSlice } from '@reduxjs/toolkit';
import { Announcement } from '../models/model.announcement';
import { AuthUser } from '../models/model.authuser';
import { Signal } from '../models/model.signal';

interface IState {
  signals: Signal[];
  announcements: Announcement[];
  authUsers: AuthUser[];
}

const State = {
  signals: [],
  announcements: [],
  authUsers: []
} as IState;

const frestoreSlice = createSlice({
  name: 'firestore',
  initialState: State,

  reducers: {
    updateSignals: (state, payload) => {
      state.signals = payload.payload;
    },
    updateAnnouncements: (state, payload) => {
      state.announcements = payload.payload;
    },
    updateAuthUsers: (state, payload) => {
      state.authUsers = payload.payload;
    }
  }
});

export const { updateSignals, updateAnnouncements, updateAuthUsers } = frestoreSlice.actions;

export default frestoreSlice.reducer;
