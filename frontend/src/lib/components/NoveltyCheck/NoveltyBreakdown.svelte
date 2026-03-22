<script lang="ts">
  import type { NoveltyAspects } from '$lib/types/noveltyCheck';

  export let aspects: NoveltyAspects;

  const ASPECTS = [
    { key: 'topic', label: 'Topic' },
    { key: 'problemStatement', label: 'Problem statement' },
    { key: 'methodology', label: 'Methodology' },
    { key: 'domain', label: 'Domain' },
  ] as const;

  function scoreColor(score: number): string {
    if (score >= 0.7) return 'bg-green-500';
    if (score >= 0.4) return 'bg-amber-400';
    return 'bg-red-400';
  }

  function scoreTextColor(score: number): string {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-amber-600';
    return 'text-red-500';
  }
</script>

<div class="border border-gray-200 rounded-xl bg-white px-5 py-5 mb-4">
  <p class="text-xs uppercase tracking-wide text-gray-400 font-medium mb-4">Breakdown</p>
  <div class="flex flex-col gap-4">
    {#each ASPECTS as aspect}
      {@const data = aspects[aspect.key]}
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-sm text-gray-700">{aspect.label}</span>
          <span class="text-sm font-medium {scoreTextColor(data.score)}"
            >{data.score.toFixed(2)}</span
          >
        </div>
        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 {scoreColor(data.score)}"
            style="width: {data.score * 100}%"
          ></div>
        </div>
        <p class="text-xs text-gray-400 mt-1">{data.summary}</p>
      </div>
    {/each}
  </div>
</div>
