<script lang="ts">
  export let score: number;
  export let verdict: string;

  function verdictColor(v: string): string {
    if (v.toLowerCase().includes('highly')) return 'bg-green-50 text-green-700 border-green-100';
    if (v.toLowerCase().includes('moderately'))
      return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-red-50 text-red-700 border-red-100';
  }
</script>

<div class="border border-gray-200 rounded-xl bg-white px-5 py-5 mb-4">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-xs uppercase tracking-wide text-gray-400 font-medium mb-1">
        Overall novelty score
      </p>
      <div class="flex items-baseline gap-3">
        <span class="text-4xl font-medium text-gray-900">{score.toFixed(2)}</span>
        <span class="text-xs border px-2 py-0.5 rounded-full {verdictColor(verdict)}"
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
          stroke="#111827"
          stroke-width="3"
          stroke-dasharray="{score * 100} 100"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>
</div>
