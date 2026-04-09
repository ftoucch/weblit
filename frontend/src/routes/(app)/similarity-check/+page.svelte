<script lang="ts">
  import { checkSimilarity } from '$lib/api/similarity';
  import type { ChunkResult } from '$lib/types/similarityCheck';

  import SimilarityInput from '$lib/components/similaritycheck/SimilarityInput.svelte';
  import SimilarityProgress from '$lib/components/similaritycheck/SimilarityProgress.svelte';
  import SimilarityScore from '$lib/components/similaritycheck/SimilarityScore.svelte';
  import SimilarityDocument from '$lib/components/SimilarityCheck/SimilarityDocument.svelte';

  let loading = false;
  let streaming = false;
  let progress = 0;
  let progressMessage = '';
  let error: string | null = null;

  let inputText = '';
  let chunks: ChunkResult[] = [];
  let totalChunks = 0;

  let overallSimilarity = 0;
  let highSimilarityChunks = 0;
  let mediumSimilarityChunks = 0;
  let lowSimilarityChunks = 0;
  let done = false;

  async function handleSubmit(
    e: CustomEvent<{
      text?: string;
      pdfBase64?: string;
      fieldOfStudy?: string;
      yearFrom?: number;
      yearTo?: number;
      minSimilarity: number;
    }>
  ) {
    loading = true;
    streaming = false;
    done = false;
    error = null;
    inputText = '';
    chunks = [];
    totalChunks = 0;
    progress = 0;
    progressMessage = '';
    overallSimilarity = 0;
    highSimilarityChunks = 0;
    mediumSimilarityChunks = 0;
    lowSimilarityChunks = 0;

    try {
      for await (const event of checkSimilarity(e.detail)) {
        if (event.type === 'progress') {
          progress = event.progress;
          progressMessage = event.message;
          loading = false;
          streaming = true;
        } else if (event.type === 'text') {
          inputText = event.content;
        } else if (event.type === 'chunk_result') {
          chunks = [
            ...chunks,
            {
              chunkIndex: event.chunkIndex,
              text: event.text,
              startChar: event.startChar,
              endChar: event.endChar,
              similarity: event.similarity,
              similarityLevel: event.similarityLevel,
              matches: event.matches,
            },
          ];
          totalChunks = Math.max(totalChunks, event.chunkIndex + 1);
          progress = event.progress;
        } else if (event.type === 'result') {
          overallSimilarity = event.overallSimilarity;
          highSimilarityChunks = event.highSimilarityChunks;
          mediumSimilarityChunks = event.mediumSimilarityChunks;
          lowSimilarityChunks = event.lowSimilarityChunks;
          totalChunks = event.totalChunks;
          streaming = false;
          done = true;
          progress = 100;
        } else if (event.type === 'error') {
          error = event.message;
          loading = false;
          streaming = false;
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Similarity check failed';
      loading = false;
      streaming = false;
    }
  }

  function reset() {
    done = false;
    inputText = '';
    chunks = [];
    error = null;
    progress = 0;
    progressMessage = '';
  }
</script>

<div class="mx-auto min-w-3xl max-w-7xl px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
  {#if !done && !streaming}
    <SimilarityInput {loading} on:submit={handleSubmit} />
  {/if}

  {#if loading || streaming}
    <SimilarityProgress
      {progress}
      message={progressMessage}
      chunksProcessed={chunks.length}
      {totalChunks}
    />
  {/if}

  {#if streaming && inputText}
    <div class="mt-6">
      <SimilarityDocument text={inputText} {chunks} {streaming} />
    </div>
  {/if}

  {#if error}
    <p class="mt-4 text-sm text-red-500">{error}</p>
  {/if}

  {#if done}
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-medium text-gray-900">Similarity report</h2>
        <p class="text-sm text-gray-400 mt-0.5">{totalChunks} sections analysed</p>
      </div>
      <button
        on:click={reset}
        class="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
      >
        Check another →
      </button>
    </div>

    <SimilarityScore
      {overallSimilarity}
      {totalChunks}
      {highSimilarityChunks}
      {mediumSimilarityChunks}
      {lowSimilarityChunks}
    />

    <SimilarityDocument text={inputText} {chunks} streaming={false} />
  {/if}
</div>
