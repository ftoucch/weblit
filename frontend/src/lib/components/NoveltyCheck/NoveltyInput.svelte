<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let text = '';
  export let loading = false;

  let panelOpen = false;
  let fieldOfStudy = '';
  let yearFrom = '';
  let yearTo = '';

  const dispatch = createEventDispatcher<{
    submit: {
      text: string;
      fieldOfStudy?: string;
      yearFrom?: number;
      yearTo?: number;
    };
  }>();

  function submit() {
    if (!text.trim() || text.trim().length < 50) return;
    dispatch('submit', {
      text: text.trim(),
      fieldOfStudy: fieldOfStudy.trim() || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
    });
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && e.metaKey) submit();
  }
</script>

<h1 class="text-4xl font-medium text-gray-900 leading-tight mb-3">Check your research novelty.</h1>
<p class="text-sm text-gray-500 leading-relaxed mb-8">
  Paste your research idea, proposal, or abstract. We'll analyse how novel it is across our
  database.
</p>

<div class="border border-gray-200 rounded-xl overflow-hidden bg-white">
  <textarea
    bind:value={text}
    on:keydown={handleKey}
    placeholder="Describe your research idea, proposal, or paste an abstract…&#10;&#10;e.g. I want to investigate the use of transformer models for automating the screening phase of systematic literature reviews in the medical domain, using active learning to reduce human effort…"
    rows="6"
    disabled={loading}
    class="w-full px-4 py-4 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none resize-none leading-relaxed disabled:opacity-50"
  ></textarea>

  <div class="border-t border-gray-100 flex items-center justify-between px-3 py-2">
    <button
      on:click={() => (panelOpen = !panelOpen)}
      aria-expanded={panelOpen}
      class="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors
        {panelOpen ? 'text-weblit' : 'text-gray-400 hover:text-gray-600'}"
    >
      <svg
        class="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
      Options
    </button>

    <div class="flex items-center gap-3">
      {#if text.trim().length > 0 && text.trim().length < 50}
        <span class="text-xs text-gray-400">{text.trim().length}/50 min</span>
      {/if}
      <button
        on:click={submit}
        disabled={loading || text.trim().length < 50}
        class="px-4 py-1.5 text-sm font-medium text-white bg-weblit rounded-lg
          hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Checking…' : 'Check novelty →'}
      </button>
    </div>
  </div>

  {#if panelOpen}
    <div class="border-t border-gray-100 px-4 py-3 grid grid-cols-3 gap-3">
      <div>
        <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1.5">
          Field of study
        </p>
        <input
          bind:value={fieldOfStudy}
          type="text"
          placeholder="e.g. Computer Science"
          class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
        />
      </div>
      <div>
        <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1.5">
          Year from
        </p>
        <input
          bind:value={yearFrom}
          type="number"
          placeholder="2018"
          class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
        />
      </div>
      <div>
        <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1.5">Year to</p>
        <input
          bind:value={yearTo}
          type="number"
          placeholder="2025"
          class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
        />
      </div>
    </div>
  {/if}
</div>
