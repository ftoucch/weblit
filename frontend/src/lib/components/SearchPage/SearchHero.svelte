<script lang="ts">

  let query = '';
  let include = '';
  let exclude = '';
  let panelOpen = false;

  function handleSearchKey(e: KeyboardEvent) {
    if (e.key === 'Enter') submit();
  }

  function submit() {
    
  }
</script>

<div class="max-w-2xl">
  <h1 class="text-4xl font-medium text-gray-900 leading-tight mb-3">
    Research made easy by meaning.
  </h1>
  <p class="text-sm text-gray-500 leading-relaxed mb-8">
    Search through series of research by meanning not just by keyword. get accurate results faster and simpler much more easy to maintain.
  </p>

  <div class="border border-gray-200 rounded-xl overflow-hidden bg-white">
    <div class="flex items-center px-4 gap-3 min-h-13">
      <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        bind:value={query}
        on:keydown={handleSearchKey}
        type="text"
        placeholder="Search 480M scholarly works…"
        class="flex-1 border-none outline-none text-sm bg-transparent text-gray-900 placeholder-gray-400"
        aria-label="Search query"
      />
      <button
        on:click={submit}
        class="border-l border-gray-200 px-4 text-sm font-medium text-weblit hover:opacity-90 self-stretch"
      >
        Search
      </button>
    </div>

    <hr class="border-t border-gray-100" />

    <div class="flex items-center min-h-9.5">
      <button
        on:click={() => (panelOpen = !panelOpen)}
        aria-expanded={panelOpen}
        aria-label="Toggle filters"
        class="flex items-center gap-1.5 px-3 self-stretch border-r border-gray-100 text-xs shrink-0
          {panelOpen ? 'text-weblit' : 'text-gray-400 hover:text-gray-700'}"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        Filters
      </button>
      <span class="px-3 text-xs text-gray-400">
        {#if include || exclude}
          {[include && `+${include}`, exclude && `−${exclude}`].filter(Boolean).join(' · ')}
        {:else}
          inclusion &amp; exclusion criteria
        {/if}
      </span>
    </div>

    {#if panelOpen}
      <div class="border-t border-gray-100 px-4 py-3 grid grid-cols-2 gap-3">
        <div>
          <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1.5">Include — must contain</p>
          <div class="relative">
            <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-green-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <input
              bind:value={include}
              on:keydown={handleSearchKey}
              type="text"
              placeholder="e.g. randomized controlled trial"
              class="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-1.5 text-xs bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
              aria-label="Include term"
            />
          </div>
        </div>

        <div>
          <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1.5">Exclude — must not contain</p>
          <div class="relative">
            <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <input
              bind:value={exclude}
              on:keydown={handleSearchKey}
              type="text"
              placeholder="e.g. case study, review"
              class="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-1.5 text-xs bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
              aria-label="Exclude term"
            />
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>