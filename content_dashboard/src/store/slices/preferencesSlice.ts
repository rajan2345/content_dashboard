import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  categories: string[];
  darkMode: boolean;
  language: string;
}

const loadPreferences = (): PreferencesState => {
  const stored = localStorage.getItem('userPreferences');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    categories: ['technology', 'sports', 'entertainment'],
    darkMode: false,
    language: 'en',
  };
};

const initialState: PreferencesState = loadPreferences();

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        state.categories = state.categories.filter(c => c !== category);
      } else {
        state.categories.push(category);
      }
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('userPreferences', JSON.stringify(state));
      
      // Update DOM
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
  },
});

export const { setCategories, toggleCategory, toggleDarkMode, setLanguage } = preferencesSlice.actions;
export default preferencesSlice.reducer;