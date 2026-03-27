<script lang="ts">
  import type { ChunkResult, ChunkMatch } from '$lib/types/similarityCheck';

  export let text: string = '';
  export let chunks: ChunkResult[] = [];
  export let streaming = false;

  let activeChunk: ChunkResult | null = null;
  let tooltipEl: HTMLDivElement;
  let anchorEl: HTMLElement | null = null;
  let tooltipTop = 0;
  let tooltipLeft = 0;

  type Segment = {
    text: string;
    chunk: ChunkResult | null;
  };

  $: segments = buildSegments(text, chunks);

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

  function highlightClass(chunk: ChunkResult): string {
    if (chunk.similarityLevel === 'high')
      return 'bg-red-100 border-b-2 border-red-400 cursor-pointer hover:bg-red-150 transition-colors rounded-sm px-0.5';
    if (chunk.similarityLevel === 'medium')
      return 'bg-amber-100 border-b-2 border-amber-400 cursor-pointer hover:bg-amber-150 transition-colors rounded-sm px-0.5';
    return '';
  }

  function showTooltip(e: MouseEvent, chunk: ChunkResult) {
    activeChunk = chunk;
    anchorEl = e.currentTarget as HTMLElement;
    const rect = anchorEl.getBoundingClientRect();
    tooltipTop = rect.top + window.scrollY - 8;
    tooltipLeft = Math.min(rect.left, window.innerWidth - 340);
  }

  function hideTooltip() {
    activeChunk = null;
    anchorEl = null;
  }

  function topMatch(chunk: ChunkResult): ChunkMatch | null {
    return chunk.matches[0] ?? null;
  }

  function truncate(text: string | null, len = 160): string {
    if (!text) return '';
    return text.length > len ? text.slice(0, len) + '…' : text;
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

  <div
    class="px-6 py-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap relative"
    style="font-family: Georgia, serif; line-height: 1.8;"
  >
    {#if text}
      {#each segments as seg}
        {#if seg.chunk}
          <span
            class={highlightClass(seg.chunk)}
            on:mouseenter={(e) => showTooltip(e, seg.chunk!)}
            on:mouseleave={hideTooltip}
            role="mark"
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
</div>

{#if activeChunk}
  {@const match = topMatch(activeChunk)}
  <div
    bind:this={tooltipEl}
    class="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 w-80 text-xs pointer-events-none"
    style="top: {tooltipTop}px; left: {tooltipLeft}px; transform: translateY(-100%)"
  >
    <div class="flex items-center gap-2 mb-2.5">
      <span
        class="px-2 py-0.5 rounded-full text-[10px] font-medium
        {activeChunk.similarityLevel === 'high'
          ? 'bg-red-50 text-red-600 border border-red-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'}"
      >
        {Math.round(activeChunk.similarity * 100)}% semantically similar
      </span>
    </div>

    {#if match}
      <p class="font-medium text-gray-900 leading-snug mb-1">{match.title}</p>
      <p class="text-gray-400 mb-2">
        {match.year ?? ''}
        {#if match.doi}· {match.doi}{/if}
      </p>

      {#if match.matchedText}
        <div class="border-t border-gray-100 pt-2 mt-2">
          <p class="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-1">
            Similar passage
          </p>
          <p class="text-gray-600 leading-relaxed italic">"{truncate(match.matchedText)}"</p>
        </div>
      {/if}

      {#if activeChunk.matches.length > 1}
        <p class="text-gray-400 mt-2 border-t border-gray-100 pt-2">
          +{activeChunk.matches.length - 1} more similar papers
        </p>
      {/if}
    {:else}
      <p class="text-gray-400">No matching papers found</p>
    {/if}
  </div>
{/if}
