// Shared types for blog posts and TIL entries

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  path: string;
  folder: string;
  date: string;
  slug: string;
}

export interface TILEntry {
  id: string;
  content: string;
  date: string;
  path: string;
}
