export type NoveltyCheckParams = {
  text: string;
  fieldOfStudy?: string;
  yearFrom?: number;
  yearTo?: number;
  topK?: number;
};

export type RelatedWork = {
  id: string;
  title: string;
  year: number | null;
  doi: string | null;
  sourceUrl: string | null;
  citationCount: number | null;
  similarity: number;
};

export type AspectResult = {
  score: number;
  summary: string;
  relatedWorks: RelatedWork[];
};

export type NoveltyAspects = {
  topic: AspectResult;
  problemStatement: AspectResult;
  methodology: AspectResult;
  domain: AspectResult;
};

export type NoveltyResult = {
  noveltyScore: number;
  verdict: string;
  aspects: NoveltyAspects;
  recommendation: string;
};

export type NoveltyEvent =
  | { type: 'progress'; message: string; progress: number }
  | { type: 'result'; result: NoveltyResult }
  | { type: 'error'; message: string };
