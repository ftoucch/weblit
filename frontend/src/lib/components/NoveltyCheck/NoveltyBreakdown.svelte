<script lang="ts">
  import type { NoveltyAspects } from '$lib/types/noveltyCheck';

  export let aspects: NoveltyAspects;

  const ASPECTS = [
    { key: 'topic', label: 'Topic' },
    { key: 'problemStatement', label: 'Problem statement' },
    { key: 'methodology', label: 'Methodology' },
    { key: 'domain', label: 'Domain' },
  ] as const;

  let expanded: string | null = null;

  function toggle(key: string) {
    expanded = expanded === key ? null : key;
  }

  function pct(score: number): number {
    return Math.round(score * 100);
  }

  function barColor(score: number): string {
    if (score >= 0.7) return 'bg-emerald-500';
    if (score >= 0.4) return 'bg-amber-400';
    return 'bg-red-400';
  }

  function badgeClass(score: number): string {
    if (score >= 0.7) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (score >= 0.4) return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-red-50 text-red-600 border border-red-200';
  }

  function badgeLabel(score: number): string {
    if (score >= 0.7) return 'Novel';
    if (score >= 0.4) return 'Moderate';
    return 'Crowded';
  }

  function simClass(sim: number): string {
    if (sim >= 0.8) return 'text-red-500 font-medium';
    if (sim >= 0.6) return 'text-amber-600 font-medium';
    return 'text-emerald-600 font-medium';
  }

  function simLabel(sim: number): string {
    if (sim >= 0.8) return 'Very similar';
    if (sim >= 0.6) return 'Similar';
    return 'Distant';
  }
</script>

<div class="border border-gray-200 rounded-xl bg-white overflow-hidden mb-4">
  <div class="px-5 py-3 border-b border-gray-100">
    <p class="text-xs uppercase tracking-wide text-gray-400 font-medium">Breakdown</p>
  </div>

  {#each ASPECTS as aspect}
    {@const data = aspects[aspect.key]}
    {@const score = data.score}
    {@const isOpen = expanded === aspect.key}

    <div class="border-b border-gray-100 last:border-0">
      <button
        on:click={() => toggle(aspect.key)}
        class="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm font-medium text-gray-800">{aspect.label}</span>
            <span class="text-[11px] px-2 py-0.5 rounded-full {badgeClass(score)}"
              >{badgeLabel(score)}</span
            >
          </div>
          <div class="flex items-center gap-3">
            <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700 {barColor(score)}"
                style="width: {pct(score)}%"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-700 tabular-nums w-10 text-right"
              >{pct(score)}%</span
            >
          </div>
        </div>

        <svg
          class="w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 {isOpen
            ? 'rotate-180'
            : ''}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {#if isOpen}
        <div class="px-5 pb-4 border-t border-gray-50">
          <p class="text-xs text-gray-500 leading-relaxed mt-3 mb-3">{data.summary}</p>

          {#if data.relatedWorks.length > 0}
            <div class="border border-gray-100 rounded-lg overflow-hidden">
              <table class="w-full text-xs">
                <thead>
                  <tr
                    class="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase tracking-wide"
                  >
                    <th class="text-left px-4 py-2 font-medium">Paper</th>
                    <th class="text-right px-3 py-2 font-medium w-24">Similarity</th>
                    <th class="text-right px-3 py-2 font-medium w-16">Year</th>
                    <th class="text-right px-4 py-2 font-medium w-20">Citations</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {#each data.relatedWorks as rw}
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-2.5 align-top">
                        {#if rw.sourceUrl}
                          <a
                            href={rw.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-gray-700 hover:text-weblit leading-snug line-clamp-2"
                            >{rw.title}</a
                          >
                        {:else}
                          <p class="text-gray-700 leading-snug line-clamp-2">{rw.title}</p>
                        {/if}
                      </td>
                      <td class="px-3 py-2.5 align-top text-right whitespace-nowrap">
                        <span class={simClass(rw.similarity)}>{pct(rw.similarity)}%</span>
                        <p class="text-[10px] text-gray-400 mt-0.5">{simLabel(rw.similarity)}</p>
                      </td>
                      <td class="px-3 py-2.5 align-top text-right text-gray-500 whitespace-nowrap">
                        {rw.year ?? '—'}
                      </td>
                      <td class="px-4 py-2.5 align-top text-right text-gray-500 whitespace-nowrap">
                        {rw.citationCount != null ? rw.citationCount : '—'}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <p class="text-xs text-gray-400 italic">No related works found for this aspect.</p>
          {/if}
        </div>
      {/if}
    </div>
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
