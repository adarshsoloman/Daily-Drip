
export interface NewsArticle {
  headline: string;
  summary: string;
  source: string;
  tags: string[];
  isStarred: boolean;
}

export enum AppState {
  Home = 'home',
  Brewing = 'brewing',
  News = 'news',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64 image data
  sources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}
