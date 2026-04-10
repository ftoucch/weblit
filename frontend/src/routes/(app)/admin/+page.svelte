<script lang="ts">
  import { onMount } from 'svelte';
  import { postRequest, getRequest } from '$lib/api/client';

  const PRESET_TOPICS = [
    { label: 'Machine Learning', topic: 'machine learning' },
    { label: 'Deep Learning', topic: 'deep learning neural networks' },
    { label: 'NLP', topic: 'natural language processing' },
    { label: 'Computer Vision', topic: 'computer vision' },
    { label: 'Systematic Reviews', topic: 'systematic literature review automation' },
    { label: 'Clinical Trials', topic: 'clinical trials randomized controlled' },
    { label: 'Medical Imaging', topic: 'medical imaging diagnosis' },
    { label: 'Drug Discovery', topic: 'drug discovery' },
    { label: 'Mental Health', topic: 'mental health intervention' },
    { label: 'HCI', topic: 'human computer interaction' },
    { label: 'EdTech', topic: 'educational technology learning' },
    { label: 'Renewable Energy', topic: 'renewable energy solar wind' },
    { label: 'Climate Change', topic: 'climate change environmental' },
    { label: 'Robotics', topic: 'robotics autonomous systems' },
    { label: 'Blockchain', topic: 'blockchain cryptocurrency' },
    { label: 'Supply Chain', topic: 'supply chain management' },
  ];

  const STORAGE_KEY = 'weblit_admin_jobs';

  type JobResult = {
    taskId: string;
    topic: string;
    limit: number;
    status: 'pending' | 'success' | 'failed';
    stored?: number;
    startedAt: string;
  };

  let topic = '';
  let limit = 100;
  let loading = false;
  let error: string | null = null;
  let jobs: JobResult[] = [];

  function saveJobs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch {}
  }

  function loadJobs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        jobs = JSON.parse(saved);
        // resume polling for any pending jobs
        jobs.filter((j) => j.status === 'pending').forEach((j) => pollStatus(j.taskId));
      }
    } catch {}
  }

  onMount(() => {
    loadJobs();
  });

  function selectPreset(t: string) {
    topic = t;
  }

  async function submit() {
    if (!topic.trim()) return;
    loading = true;
    error = null;

    try {
      const res = await postRequest<{ taskId: string; topic: string; limit: number }>(
        '/admin/ingest-topic',
        { topic: topic.trim(), limit }
      );

      const newJob: JobResult = {
        taskId: res.taskId,
        topic: res.topic,
        limit: res.limit,
        status: 'pending',
        startedAt: new Date().toISOString(),
      };

      jobs = [newJob, ...jobs];
      saveJobs();
      topic = '';
      pollStatus(res.taskId);
    } catch (err: any) {
      error = err?.detail || 'Failed to start ingestion';
    } finally {
      loading = false;
    }
  }

  async function pollStatus(taskId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await getRequest<{ status: string; result?: { stored?: number } }>(
          `/admin/ingest-status/${taskId}`
        );

        if (res.status === 'SUCCESS') {
          jobs = jobs.map((j) =>
            j.taskId === taskId
              ? { ...j, status: 'success', stored: res.result?.stored }
              : j
          );
          saveJobs();
          clearInterval(interval);
        } else if (res.status === 'FAILURE') {
          jobs = jobs.map((j) =>
            j.taskId === taskId ? { ...j, status: 'failed' } : j
          );
          saveJobs();
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    }, 3000);
  }

  function clearJobs() {
    jobs = [];
    saveJobs();
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }
</script>

<div class="mx-auto min-w-3xl max-w-7xl px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
  <h1 class="text-4xl font-medium text-gray-900 leading-tight mb-3">Topic ingestion</h1>
  <p class="text-sm text-gray-500 leading-relaxed mb-8">
    Pre-populate the search index with papers on specific topics to improve search speed.
  </p>

  <!-- Input -->
  <div class="border border-gray-200 rounded-xl overflow-hidden bg-white mb-6">
    <div class="px-4 py-4">
      <p class="text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-2">Topic</p>
      <input
        bind:value={topic}
        type="text"
        placeholder="e.g. transformer models for medical NLP"
        class="w-full text-sm text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none"
        on:keydown={(e) => e.key === 'Enter' && submit()}
      />
    </div>

    <div class="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <p class="text-xs text-gray-400">Limit</p>
        {#each [50, 100, 200, 500] as n}
          <button
            on:click={() => (limit = n)}
            class="px-2.5 py-1 text-xs rounded-lg border transition-colors
              {limit === n
                ? 'border-weblit text-weblit bg-weblit/5'
                : 'border-gray-200 text-gray-400 hover:border-gray-300'}"
          >
            {n}
          </button>
        {/each}
      </div>
      <button
        on:click={submit}
        disabled={loading || !topic.trim()}
        class="px-4 py-1.5 text-sm font-medium text-white bg-weblit rounded-lg
          hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Starting…' : 'Ingest →'}
      </button>
    </div>
  </div>

  <!-- Preset topics -->
  <div class="mb-8">
    <p class="text-xs uppercase tracking-wide text-gray-400 font-medium mb-3">Quick presets</p>
    <div class="flex flex-wrap gap-2">
      {#each PRESET_TOPICS as preset}
        <button
          on:click={() => selectPreset(preset.topic)}
          class="px-3 py-1.5 text-xs rounded-lg border transition-colors
            {topic === preset.topic
              ? 'border-weblit text-weblit bg-weblit/5'
              : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
        >
          {preset.label}
        </button>
      {/each}
    </div>
  </div>

  {#if error}
    <p class="text-sm text-red-500 mb-4">{error}</p>
  {/if}

  <!-- Jobs -->
  {#if jobs.length > 0}
    <div class="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <p class="text-xs uppercase tracking-wide text-gray-400 font-medium">Ingestion jobs</p>
        <button
          on:click={clearJobs}
          class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div class="divide-y divide-gray-100">
        {#each jobs as job}
          <div class="px-5 py-3 flex items-center justify-between gap-4">
            <div class="min-w-0">
              <p class="text-sm text-gray-800">{job.topic}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                {job.limit} papers · {formatDate(job.startedAt)}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              {#if job.status === 'pending'}
                <span class="flex items-center gap-1.5 text-xs text-gray-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse inline-block"></span>
                  Running…
                </span>
              {:else if job.status === 'success'}
                <span class="text-xs text-emerald-600 font-medium">
                  ✓ {job.stored ?? 0} papers indexed
                </span>
              {:else}
                <span class="text-xs text-red-500">Failed</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>