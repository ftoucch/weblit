export type SimilarityCheckParams = {
  text?: string;
  pdfBase64?: string;
  fieldOfStudy?: string;
  yearFrom?: number;
  yearTo?: number;
  minSimilarity?: number;
};

export type ChunkMatch = {
  paperId: string;
  title: string;
  year: number | null;
  doi: string | null;
  sourceUrl: string | null;
  similarity: number;
  matchedText: string | null;
};

export type ChunkResult = {
  chunkIndex: number;
  text: string;
  startChar: number;
  endChar: number;
  similarity: number;
  similarityLevel: 'high' | 'medium' | 'low';
  matches: ChunkMatch[];
};

export type SimilarityEvent =
  | { type: 'progress'; message: string; progress: number }
  | { type: 'text'; content: string }
  | ({ type: 'chunk_result' } & ChunkResult & { progress: number })
  | {
      type: 'result';
      overallSimilarity: number;
      totalChunks: number;
      highSimilarityChunks: number;
      mediumSimilarityChunks: number;
      lowSimilarityChunks: number;
    }
  | { type: 'error'; message: string };