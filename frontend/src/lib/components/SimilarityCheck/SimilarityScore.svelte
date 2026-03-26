<script lang="ts">
  export let overallSimilarity: number;
  export let totalChunks: number;
  export let highSimilarityChunks: number;
  export let mediumSimilarityChunks: number;
  export let lowSimilarityChunks: number;

  $: pct = Math.round(overallSimilarity * 100);

  function verdictClass(p: number): string {
    if (p >= 75) return 'bg-red-50 text-red-600 border-red-200';
    if (p >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  function verdict(p: number): string {
    if (p >= 75) return 'Highly similar';
    if (p >= 50) return 'Moderately similar';
    return 'Mostly original';
  }

  function ringColor(p: number): string {
    if (p >= 75) return '#f87171';
    if (p >= 50) return '#f59e0b';
    return '#10b981';
  }
</script>

<div class="border border-gray-200 rounded-xl bg-white px-5 py-5 mb-4">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-xs uppercase tracking-wide text-gray-400 font-medium mb-1">Semantic similarity</p>
      <div class="flex items-baseline gap-3">
        <span class="text-4xl font-medium text-gray-900">{pct}%</span>
        <span class="text-xs border px-2 py-0.5 rounded-full {verdictClass(pct)}">{verdict(pct)}</span>
      </div>
    </div>
    <div class="w-16 h-16">
      <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" stroke-width="3"/>
        <circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={ringColor(pct)} stroke-width="3"
          stroke-dasharray="{pct} 100"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>

  <div class="mt-4 grid grid-cols-3 gap-3">
    <div class="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-center">
      <p class="text-lg font-medium text-red-600">{highSimilarityChunks}</p>
      <p class="text-[11px] text-red-400 mt-0.5">High similarity</p>
    </div>
    <div class="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 text-center">
      <p class="text-lg font-medium text-amber-600">{mediumSimilarityChunks}</p>
      <p class="text-[11px] text-amber-400 mt-0.5">Medium similarity</p>
    </div>
    <div class="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2.5 text-center">
      <p class="text-lg font-medium text-emerald-600">{lowSimilarityChunks}</p>
      <p class="text-[11px] text-emerald-400 mt-0.5">Original sections</p>
    </div>
  </div>
</div>