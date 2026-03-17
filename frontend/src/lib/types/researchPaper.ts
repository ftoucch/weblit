export type PaperAuthor = {
  name: string;
  institution: string;
};

export type Paper = {
  id: string;
  title: string;
  abstract: string | null;
  authors: PaperAuthor[];
  year: number | null;
  fieldOfStudy: string | null;
  source: string;
  sourceUrl: string | null;
  doi: string | null;
  citationCount: number | null;
  hasFullText: boolean;
  similarityScore: number;
  meetsInclusion: boolean | null;
  meetsExclusion: boolean | null;
};

export type SearchResultEvent =
  | { type: 'result'; paper: Paper; cached: boolean }
  | { type: 'done'; total: number; cached: number; new: number }
  | { type: 'error'; message: string };

export type SearchParams = {
  query: string;
  include?: string;
  exclude?: string;
  fieldOfStudy?: string;
  yearFrom?: number;
  yearTo?: number;
  limit?: number;
  minSimilarity?: number;
};