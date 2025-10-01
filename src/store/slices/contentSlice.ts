import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, ContentType } from '@/types/content';

interface ContentState {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: ContentState = {
  items: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
};

// Mock data generator for demonstration
const generateMockContent = (page: number, categories: string[]): ContentItem[] => {
  const types: ContentType[] = ['news', 'movie', 'social'];
  const mockItems: ContentItem[] = [];
  
  for (let i = 0; i < 10; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)] || 'technology';
    
    mockItems.push({
      id: `${type}-${page}-${i}`,
      type,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)}: ${type === 'news' ? 'Breaking News' : type === 'movie' ? 'Popular Movie' : 'Trending Post'} #${page * 10 + i}`,
      description: `This is a ${type} item about ${category}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.`,
      image: `https://picsum.photos/seed/${page}-${i}/400/250`,
      category,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: type === 'news' ? 'News Network' : type === 'movie' ? 'TMDB' : 'Social Media',
    });
  }
  
  return mockItems;
};

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async ({ page, categories }: { page: number; categories: string[] }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMockContent(page, categories);
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    reorderContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
    },
    resetContent: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.meta.arg.page === 1 
          ? action.payload 
          : [...state.items, ...action.payload];
        state.page = action.meta.arg.page;
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      });
  },
});

export const { reorderContent, resetContent } = contentSlice.actions;
export default contentSlice.reducer;
