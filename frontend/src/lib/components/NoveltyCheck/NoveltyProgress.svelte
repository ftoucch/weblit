<script lang="ts">
  export let progress = 0;
  export let message = '';

  const STEPS = [
    { message: 'Analysing your text', pct: 5 },
    { message: 'Checking topic novelty', pct: 20 },
    { message: 'Checking problem statement', pct: 40 },
    { message: 'Checking methodology novelty', pct: 60 },
    { message: 'Checking domain novelty', pct: 78 },
    { message: 'Computing novelty score', pct: 92 },
  ];
</script>

<div class="mt-6 border border-gray-200 rounded-xl bg-white px-5 py-5">
  <div class="flex items-center justify-between mb-3">
    <p class="text-sm text-gray-600">{message}</p>
    <span class="text-xs text-gray-400 tabular-nums">{progress}%</span>
  </div>

  <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
    <div
      class="h-full bg-gray-900 rounded-full transition-all duration-500"
      style="width: {progress}%"
    ></div>
  </div>

  <div class="mt-4 flex flex-col gap-2.5">
    {#each STEPS as step}
      {@const done = progress > step.pct}
      {@const active = progress >= step.pct && progress <= step.pct + 20}
      <div class="flex items-center gap-2.5">
        <div
          class="w-4 h-4 rounded-full flex items-center justify-center shrink-0
          {done ? 'bg-gray-900' : active ? 'border-2 border-gray-400' : 'border border-gray-200'}"
        >
          {#if done}
            <svg class="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2 2 4-4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          {:else if active}
            <div class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"></div>
          {/if}
        </div>
        <span class="text-xs {done ? 'text-gray-500' : active ? 'text-gray-700' : 'text-gray-300'}">
          {step.message}
        </span>
      </div>
    {/each}
  </div>
</div>
