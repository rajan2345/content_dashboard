import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types/content';

interface FavoritesState {
  items: ContentItem[];
}

const loadFavorites = (): FavoritesState => {
  const stored = localStorage.getItem('favorites');
  if (stored) {
    return JSON.parse(stored);
  }
  return { items: [] };
};

const initialState: FavoritesState = loadFavorites();

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.unshift(action.payload);
      }
      localStorage.setItem('favorites', JSON.stringify(state));
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.setItem('favorites', JSON.stringify(state));
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;