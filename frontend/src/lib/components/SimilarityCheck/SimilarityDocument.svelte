<script lang="ts">
  import type { ChunkResult } from '$lib/types/similarityCheck';

  export let text: string = '';
  export let chunks: ChunkResult[] = [];
  export let streaming = false;

  let selectedChunk: ChunkResult | null = null;

  type Segment = {
    text: string;
    chunk: ChunkResult | null;
  };

  $: segments = buildSegments(text, chunks);
  $: highlightedChunks = chunks
    .filter((c) => c.similarityLevel !== 'low')
    .sort((a, b) => b.similarity - a.similarity);

  function buildSegments(fullText: string, chunkList: ChunkResult[]): Segment[] {
    if (!fullText) return [];
    if (!chunkList.length) return [{ text: fullText, chunk: null }];

    const relevant = chunkList
      .filter((c) => c.similarityLevel !== 'low')
      .sort((a, b) => a.startChar - b.startChar);

    const segs: Segment[] = [];
    let cursor = 0;

    for (const chunk of relevant) {
      if (chunk.startChar > cursor) {
        segs.push({ text: fullText.slice(cursor, chunk.startChar), chunk: null });
      }
      const start = Math.max(chunk.startChar, cursor);
      const end = chunk.endChar;
      if (start < end) {
        segs.push({ text: fullText.slice(start, end), chunk });
        cursor = end;
      }
    }

    if (cursor < fullText.length) {
      segs.push({ text: fullText.slice(cursor), chunk: null });
    }

    return segs;
  }

  function spanClass(chunk: ChunkResult): string {
    const isSelected = selectedChunk?.chunkIndex === chunk.chunkIndex;
    if (chunk.similarityLevel === 'high') {
      return isSelected
        ? 'bg-red-200 border-b-2 border-red-500 cursor-pointer rounded-sm px-0.5'
        : 'bg-red-100 border-b-2 border-red-400 cursor-pointer hover:bg-red-200 transition-colors rounded-sm px-0.5';
    }
    if (chunk.similarityLevel === 'medium') {
      return isSelected
        ? 'bg-amber-200 border-b-2 border-amber-500 cursor-pointer rounded-sm px-0.5'
        : 'bg-amber-100 border-b-2 border-amber-400 cursor-pointer hover:bg-amber-200 transition-colors rounded-sm px-0.5';
    }
    return '';
  }

  function selectChunk(chunk: ChunkResult) {
    selectedChunk = selectedChunk?.chunkIndex === chunk.chunkIndex ? null : chunk;
  }

  function simBadge(level: string): string {
    if (level === 'high') return 'bg-red-50 text-red-600 border border-red-200';
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }

  function simColor(similarity: number): string {
    if (similarity >= 0.75) return 'text-red-600';
    if (similarity >= 0.5) return 'text-amber-600';
    return 'text-emerald-600';
  }

  function truncate(t: string | null, len = 240): string {
    if (!t) return '';
    return t.length > len ? t.slice(0, len) + '…' : t;
  }

  function previewText(chunk: ChunkResult): string {
    return chunk.text.length > 80 ? chunk.text.slice(0, 80) + '…' : chunk.text;
  }
</script>

<div class="border border-gray-200 rounded-xl bg-white overflow-hidden mb-4">
  <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
    <p class="text-xs uppercase tracking-wide text-gray-400 font-medium">Document view</p>
    <div class="flex items-center gap-4 text-[11px] text-gray-400">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-2 rounded-sm bg-red-200 border-b border-red-400 inline-block"></span>
        High similarity
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-2 rounded-sm bg-amber-200 border-b border-amber-400 inline-block"></span>
        Medium similarity
      </span>
      {#if !streaming && highlightedChunks.length > 0}
        <span>· click a highlight to see matches</span>
      {/if}
      {#if streaming}
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse inline-block"></span>
          Analysing…
        </span>
      {/if}
    </div>
  </div>

  <div class="flex divide-x divide-gray-100">
    <!-- Document text -->
    <div
      class="flex-1 px-6 py-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[600px]"
      style="font-family: Georgia, serif; line-height: 1.8;"
    >
      {#if text}
        {#each segments as seg}
          {#if seg.chunk}
            <span
              class={spanClass(seg.chunk)}
              on:click={() => selectChunk(seg.chunk!)}
              role="button"
              tabindex="0"
              on:keydown={(e) => e.key === 'Enter' && selectChunk(seg.chunk!)}
              aria-label="Semantically similar section">{seg.text}</span
            >
          {:else}
            {seg.text}
          {/if}
        {/each}
      {:else if streaming}
        <div class="space-y-2 animate-pulse">
          <div class="h-3 bg-gray-100 rounded w-full"></div>
          <div class="h-3 bg-gray-100 rounded w-5/6"></div>
          <div class="h-3 bg-gray-100 rounded w-full"></div>
          <div class="h-3 bg-gray-100 rounded w-4/5"></div>
          <div class="h-3 bg-gray-100 rounded w-full"></div>
        </div>
      {/if}
    </div>

    <!-- Side panel -->
    <div class="w-96 shrink-0 flex flex-col overflow-y-auto max-h-[600px]">
      {#if !selectedChunk}
        {#if highlightedChunks.length > 0}
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-xs uppercase tracking-wide text-gray-400 font-medium">
              {highlightedChunks.length} similar sections found
            </p>
          </div>
          <div class="divide-y divide-gray-100">
            {#each highlightedChunks as chunk}
              <button
                on:click={() => selectChunk(chunk)}
                class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-2 mb-1.5">
                  <span
                    class="text-[10px] px-1.5 py-0.5 rounded-full {simBadge(chunk.similarityLevel)}"
                  >
                    {Math.round(chunk.similarity * 100)}%
                  </span>
                  <span class="text-[11px] text-gray-400">
                    {chunk.matches.length} matching paper{chunk.matches.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p class="text-xs text-gray-500 leading-relaxed">{previewText(chunk)}</p>
              </button>
            {/each}
          </div>
        {:else if streaming}
          <div class="px-4 py-4 space-y-3 animate-pulse">
            {#each Array(3) as _}
              <div class="h-12 bg-gray-100 rounded-lg"></div>
            {/each}
          </div>
        {:else}
          <div class="px-4 py-8 text-center">
            <p class="text-sm text-gray-400">No similar sections found</p>
          </div>
        {/if}
      {:else}
        <!-- Detail view -->
        <div
          class="px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10"
        >
          <span
            class="text-[10px] px-1.5 py-0.5 rounded-full {simBadge(selectedChunk.similarityLevel)}"
          >
            {Math.round(selectedChunk.similarity * 100)}% semantically similar
          </span>
          <button
            on:click={() => (selectedChunk = null)}
            class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← all sections
          </button>
        </div>

        <!-- Your text -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-2">
            Your text
          </p>
          <div
            class="bg-gray-50 rounded-lg px-3 py-2.5 border-l-2
            {selectedChunk.similarityLevel === 'high' ? 'border-red-400' : 'border-amber-400'}"
          >
            <p class="text-xs text-gray-700 leading-relaxed">{truncate(selectedChunk.text, 300)}</p>
          </div>
        </div>

        <!-- Matching papers -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
            {selectedChunk.matches.length} matching paper{selectedChunk.matches.length !== 1
              ? 's'
              : ''}
          </p>
        </div>

        <div class="divide-y divide-gray-100">
          {#each selectedChunk.matches as match}
            <div class="px-4 py-4">
              <!-- Paper header -->
              <div class="flex items-start justify-between gap-2 mb-2">
                <p class="text-xs font-medium text-gray-800 leading-snug flex-1">{match.title}</p>
                <span
                  class="text-xs font-medium tabular-nums shrink-0 {simColor(match.similarity)}"
                >
                  {Math.round(match.similarity * 100)}%
                </span>
              </div>

              <p class="text-[11px] text-gray-400 mb-3">
                {match.year ?? '—'}
                {#if match.doi}· <span class="font-mono">{match.doi}</span>{/if}
              </p>

              <!-- Matched passage from that paper -->
              {#if match.matchedText}
                <div class="mb-3">
                  <p class="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-1.5">
                    Matching passage in this paper
                  </p>
                  <div class="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                    <p class="text-[11px] text-gray-700 leading-relaxed italic">
                      "{truncate(match.matchedText)}"
                    </p>
                  </div>
                </div>
              {:else}
                <div class="mb-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <p class="text-[11px] text-gray-400 italic">
                    Full text not yet indexed — similarity based on abstract
                  </p>
                </div>
              {/if}

              {#if match.sourceUrl}
                <a
                  href={match.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-[11px] text-weblit hover:underline font-medium"
                >
                  Open paper ↗
                </a>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
