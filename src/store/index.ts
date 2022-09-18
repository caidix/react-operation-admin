import { configureStore } from '@reduxjs/toolkit';
import appJson from '../../package.json';
import userReducer from './user';
import settingReducer from './setting';

export const store = configureStore({
  reducer: {
    user: userReducer,
    setting: settingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
