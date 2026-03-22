<script lang="ts">
  import type { NoveltyAspects } from '$lib/types/noveltyCheck';

  export let aspects: NoveltyAspects;

  const ASPECTS = [
    { key: 'topic', label: 'Topic' },
    { key: 'problemStatement', label: 'Problem statement' },
    { key: 'methodology', label: 'Methodology' },
    { key: 'domain', label: 'Domain' },
  ] as const;
</script>

<div class="border border-gray-200 rounded-xl bg-white overflow-hidden">
  <div class="px-5 py-3 border-b border-gray-100">
    <p class="text-xs uppercase tracking-wide text-gray-400 font-medium">Related works</p>
  </div>

  {#each ASPECTS as aspect, ai}
    {@const data = aspects[aspect.key]}
    {#if data.relatedWorks.length > 0}
      <div class={ai < ASPECTS.length - 1 ? 'border-b border-gray-100' : ''}>
        <div class="px-5 py-2 bg-gray-50">
          <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
            {aspect.label}
          </p>
        </div>
        <div class="divide-y divide-gray-100">
          {#each data.relatedWorks as rw}
            <div class="px-5 py-3 flex items-baseline justify-between gap-4">
              <div class="flex-1 min-w-0">
                {#if rw.sourceUrl}
                  <a
                    href={rw.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-gray-800 hover:text-weblit leading-snug line-clamp-2"
                    >{rw.title}</a
                  >
                {:else}
                  <p class="text-sm text-gray-800 leading-snug line-clamp-2">{rw.title}</p>
                {/if}
              </div>
              <div class="flex items-center gap-3 flex-shrink-0 text-xs text-gray-400 tabular-nums">
                <span>{rw.similarity.toFixed(2)}</span>
                {#if rw.year}<span>{rw.year}</span>{/if}
                {#if rw.citationCount != null}<span>{rw.citationCount} cit.</span>{/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
