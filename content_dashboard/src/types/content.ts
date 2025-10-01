export type ContentType = 'news' | 'movie' | 'social';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  source: string;
  url?: string;
}

export const AVAILABLE_CATEGORIES = [
  'technology',
  'sports',
  'entertainment',
  'business',
  'science',
  'health',
] as const;

export type Category = typeof AVAILABLE_CATEGORIES[number];