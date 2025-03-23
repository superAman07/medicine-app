import { configureStore } from '@reduxjs/toolkit';
import pharmaReducer from './features/pharma/pharmaSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      pharma: pharmaReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];