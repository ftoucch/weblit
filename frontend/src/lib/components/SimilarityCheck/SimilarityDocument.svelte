<script lang="ts">
  import type { ChunkResult, ChunkMatch } from "$lib/types/similarityCheck";

  export let text: string = '';
  export let chunks: ChunkResult[] = [];
  export let streaming = false;

  let activeChunk: ChunkResult | null = null;
  let tooltipX = 0;
  let tooltipY = 0;

  type Segment = {
    text: string;
    chunk: ChunkResult | null;
  };

  $: segments = buildSegments(text, chunks);

  function buildSegments(fullText: string, chunkList: ChunkResult[]): Segment[] {
    if (!fullText) return [];
    if (!chunkList.length) return [{ text: fullText, chunk: null }];

    const relevant = chunkList
      .filter(c => c.similarityLevel !== 'low')
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

  function highlightClass(chunk: ChunkResult): string {
    if (chunk.similarityLevel === 'high')   return 'bg-red-100 border-b-2 border-red-400 cursor-pointer hover:bg-red-200';
    if (chunk.similarityLevel === 'medium') return 'bg-amber-100 border-b-2 border-amber-400 cursor-pointer hover:bg-amber-200';
    return '';
  }

  function showTooltip(e: MouseEvent, chunk: ChunkResult) {
    activeChunk = chunk;
    tooltipX = (e.target as HTMLElement).getBoundingClientRect().left;
    tooltipY = (e.target as HTMLElement).getBoundingClientRect().top - 8;
  }

  function hideTooltip() {
    activeChunk = null;
  }

  function topMatch(chunk: ChunkResult): ChunkMatch | null {
    return chunk.matches[0] ?? null;
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
      {#if streaming}
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse inline-block"></span>
          Analysing…
        </span>
      {/if}
    </div>
  </div>

  <div class="px-6 py-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-serif relative">
    {#if text}
      {#each segments as seg}
        {#if seg.chunk}
          <span
            class="relative transition-colors rounded-sm px-0.5 {highlightClass(seg.chunk)}"
            on:mouseenter={(e) => showTooltip(e, seg.chunk!)}
            on:mouseleave={hideTooltip}
            role="mark"
            aria-label="Semantically similar section"
          >{seg.text}</span>
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
      </div>
    {/if}
  </div>
</div>

{#if activeChunk}
  {@const match = topMatch(activeChunk)}
  <div
    class="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 max-w-xs text-xs pointer-events-none"
    style="top: {tooltipY}px; left: {tooltipX}px; transform: translateY(-100%)"
  >
    <div class="flex items-center gap-2 mb-2">
      <span class="px-1.5 py-0.5 rounded text-[10px] font-medium
        {activeChunk.similarityLevel === 'high' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}">
        {Math.round(activeChunk.similarity * 100)}% semantically similar
      </span>
    </div>
    {#if match}
      <p class="font-medium text-gray-800 leading-snug mb-1">{match.title}</p>
      <p class="text-gray-400">
        {match.year ?? ''}
        {#if match.year && match.similarity}·{/if}
        {match.similarity ? Math.round(match.similarity * 100) + '% match' : ''}
      </p>
      {#if activeChunk.matches.length > 1}
        <p class="text-gray-400 mt-1">+{activeChunk.matches.length - 1} more similar papers</p>
      {/if}
    {:else}
      <p class="text-gray-400">No matching papers found</p>
    {/if}
  </div>
{/if}

<style>
  .font-serif {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 14px;
    line-height: 1.8;
  }
</style>