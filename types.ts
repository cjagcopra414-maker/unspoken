
export type ConfessionType = 'music' | 'book';

export interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

export interface AnonymousMessage {
  id: string;
  targetId: string; // The ID of the confession or user link
  text: string;
  timestamp: number;
}

export interface Suggestion {
  title: string;
  sub: string; // Artist or Author
  lines: string; // Lyric or Quote
}

export interface Confession {
  id: string;
  type: ConfessionType;
  to: string;
  sourceTitle: string; // Song or Book title
  sourceSub: string;   // Artist or Author
  dedicatedLines: string;
  message: string;
  timestamp: number;
  likes: number;
  comments: Comment[];
}

export interface GeminiResponse {
  suggestions: Suggestion[];
}
