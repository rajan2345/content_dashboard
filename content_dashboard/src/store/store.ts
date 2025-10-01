import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import preferencesReducer from './slices/preferencesSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
    preferences: preferencesReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;