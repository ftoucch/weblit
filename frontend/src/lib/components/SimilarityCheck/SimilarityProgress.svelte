<script lang="ts">
  export let progress = 0;
  export let message = '';
  export let chunksProcessed = 0;
  export let totalChunks = 0;
</script>

<div class="mt-6 border border-gray-200 rounded-xl bg-white px-5 py-5">
  <div class="flex items-center justify-between mb-3">
    <p class="text-sm text-gray-600">{message}</p>
    <span class="text-xs text-gray-400 tabular-nums">{progress}%</span>
  </div>

  <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
    <div
      class="h-full bg-gray-900 rounded-full transition-all duration-300"
      style="width: {progress}%"
    ></div>
  </div>

  {#if totalChunks > 0}
    <div class="flex items-center justify-between mt-3">
      <span class="text-xs text-gray-400">
        {chunksProcessed} of {totalChunks} sections analysed
      </span>
      <div class="flex gap-3 text-[11px] text-gray-400">
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span> High overlap
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Medium
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Low
        </span>
      </div>
    </div>
  {/if}
</div>