<script lang="ts">
  export let score: number;
  export let verdict: string;

  $: pct = Math.round(score * 100);

  function verdictClass(v: string): string {
    if (v.toLowerCase().includes('highly'))
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (v.toLowerCase().includes('moderately'))
      return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-600 border-red-200';
  }

  function ringColor(v: string): string {
    if (v.toLowerCase().includes('highly')) return '#10b981';
    if (v.toLowerCase().includes('moderately')) return '#f59e0b';
    return '#f87171';
  }
</script>

<div class="border border-gray-200 rounded-xl bg-white px-5 py-5 mb-4">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-xs uppercase tracking-wide text-gray-400 font-medium mb-1">
        Overall novelty score
      </p>
      <div class="flex items-baseline gap-3">
        <span class="text-4xl font-medium text-gray-900">{pct}%</span>
        <span class="text-xs border px-2 py-0.5 rounded-full {verdictClass(verdict)}"
          >{verdict}</span
        >
      </div>
    </div>
    <div class="w-16 h-16">
      <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" stroke-width="3" />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke={ringColor(verdict)}
          stroke-width="3"
          stroke-dasharray="{pct} 100"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>
</div>
