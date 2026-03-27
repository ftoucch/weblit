<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let loading = false;

  let mode: 'text' | 'pdf' = 'text';
  let text = '';
  let pdfFile: File | null = null;
  let pdfBase64: string | null = null;
  let panelOpen = false;
  let fieldOfStudy = '';
  let yearFrom = '';
  let yearTo = '';
  let minSimilarity = 0.5;

  const dispatch = createEventDispatcher<{
    submit: {
      text?: string;
      pdfBase64?: string;
      fieldOfStudy?: string;
      yearFrom?: number;
      yearTo?: number;
      minSimilarity: number;
    };
  }>();

  $: valid = mode === 'text' ? text.trim().length >= 200 : pdfBase64 !== null;

  async function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    pdfFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      pdfBase64 = result.split(',')[1];
    };
    reader.readAsDataURL(file);
  }

  function submit() {
    if (!valid) return;
    dispatch('submit', {
      text: mode === 'text' ? text.trim() : undefined,
      pdfBase64: mode === 'pdf' ? (pdfBase64 ?? undefined) : undefined,
      fieldOfStudy: fieldOfStudy.trim() || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
      minSimilarity,
    });
  }
</script>

<h1 class="text-4xl font-medium text-gray-900 leading-tight mb-3">Full text similarity check.</h1>
<p class="text-sm text-gray-500 leading-relaxed mb-8">
  Paste your paper or upload a PDF. We'll analyse each section against existing literature and show
  you where your work overlaps.
</p>

<div class="border border-gray-200 rounded-xl overflow-hidden bg-white">
  <div class="flex border-b border-gray-100">
    <button
      on:click={() => (mode = 'text')}
      class="flex-1 px-4 py-2.5 text-xs font-medium transition-colors
        {mode === 'text'
        ? 'text-gray-900 bg-gray-50 border-b-2 border-gray-900'
        : 'text-gray-400 hover:text-gray-600'}"
    >
      Paste text
    </button>
    <button
      on:click={() => (mode = 'pdf')}
      class="flex-1 px-4 py-2.5 text-xs font-medium transition-colors
        {mode === 'pdf'
        ? 'text-gray-900 bg-gray-50 border-b-2 border-gray-900'
        : 'text-gray-400 hover:text-gray-600'}"
    >
      Upload PDF
    </button>
  </div>

  {#if mode === 'text'}
    <textarea
      bind:value={text}
      placeholder="Paste your full paper or document here…"
      rows="8"
      disabled={loading}
      class="w-full px-4 py-4 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none resize-none leading-relaxed disabled:opacity-50"
    ></textarea>
  {:else}
    <div class="px-4 py-8 flex flex-col items-center justify-center gap-3">
      <label
        class="w-full border-2 border-dashed border-gray-200 rounded-xl px-6 py-8 flex flex-col items-center gap-2 cursor-pointer hover:border-gray-300 transition-colors"
      >
        <svg
          class="w-8 h-8 text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {#if pdfFile}
          <span class="text-sm text-gray-700 font-medium">{pdfFile.name}</span>
          <span class="text-xs text-gray-400">{(pdfFile.size / 1024).toFixed(0)} KB</span>
        {:else}
          <span class="text-sm text-gray-500">Click to upload PDF</span>
          <span class="text-xs text-gray-400">or drag and drop</span>
        {/if}
        <input
          type="file"
          accept=".pdf"
          on:change={handleFileChange}
          class="hidden"
          disabled={loading}
        />
      </label>
    </div>
  {/if}

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
      {#if mode === 'text' && text.trim().length > 0 && text.trim().length < 200}
        <span class="text-xs text-gray-400">{text.trim().length}/200 min</span>
      {/if}
      <button
        on:click={submit}
        disabled={loading || !valid}
        class="px-4 py-1.5 text-sm font-medium text-white bg-weblit rounded-lg
          hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Checking…' : 'Check similarity →'}
      </button>
    </div>
  </div>

  {#if panelOpen}
    <div class="border-t border-gray-100 px-4 py-3 grid grid-cols-2 gap-3">
      <div class="col-span-2">
        <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1.5">
          Min similarity threshold — {Math.round(minSimilarity * 100)}%
        </p>
        <input
          type="range"
          bind:value={minSimilarity}
          min="0.1"
          max="0.9"
          step="0.05"
          class="w-full accent-weblit"
        />
        <div class="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>10% — show more</span>
          <span>90% — strict matches only</span>
        </div>
      </div>
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
      <div class="grid grid-cols-2 gap-2">
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
          <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1.5">
            Year to
          </p>
          <input
            bind:value={yearTo}
            type="number"
            placeholder="2025"
            class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
          />
        </div>
      </div>
    </div>
  {/if}
</div>
