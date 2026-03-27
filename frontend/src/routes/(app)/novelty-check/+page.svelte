<script lang="ts">
  import { checkNovelty } from '$lib/api/novelty';
  import type { NoveltyResult } from '$lib/types/noveltyCheck';

  import NoveltyInput from '$lib/components/NoveltyCheck/NoveltyInput.svelte';
  import NoveltyProgress from '$lib/components/NoveltyCheck/NoveltyProgress.svelte';
  import NoveltyScore from '$lib/components/NoveltyCheck/NoveltyScore.svelte';
  import NoveltyBreakdown from '$lib/components/NoveltyCheck/NoveltyBreakdown.svelte';
  import NoveltyRecommendation from '$lib/components/NoveltyCheck/NoveltyRecommendation.svelte';

  let text = '';
  let loading = false;
  let progress = 0;
  let progressMessage = '';
  let error: string | null = null;
  let result: NoveltyResult | null = null;

  async function handleSubmit(
    e: CustomEvent<{
      text: string;
      fieldOfStudy?: string;
      yearFrom?: number;
      yearTo?: number;
    }>
  ) {
    loading = true;
    error = null;
    result = null;
    progress = 0;
    progressMessage = '';
    text = e.detail.text;

    try {
      for await (const event of checkNovelty({
        ...e.detail,
        topK: 50,
      })) {
        if (event.type === 'progress') {
          progress = event.progress;
          progressMessage = event.message;
        } else if (event.type === 'result') {
          result = event.result;
          progress = 100;
          loading = false;
        } else if (event.type === 'error') {
          error = event.message;
          loading = false;
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Novelty check failed';
      loading = false;
    }
  }

  function reset() {
    result = null;
    error = null;
    progress = 0;
    progressMessage = '';
    text = '';
  }

  $: totalRelatedWorks = result
    ? result.aspects.topic.relatedWorks.length +
      result.aspects.problemStatement.relatedWorks.length +
      result.aspects.methodology.relatedWorks.length +
      result.aspects.domain.relatedWorks.length
    : 0;
</script>

<div class="mx-auto min-w-3xl max-w-7xl px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
  {#if !result}
    <NoveltyInput {text} {loading} on:submit={handleSubmit} />

    {#if loading}
      <NoveltyProgress {progress} message={progressMessage} />
    {/if}

    {#if error}
      <p class="mt-4 text-sm text-red-500">{error}</p>
    {/if}
  {/if}

  {#if result}
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-medium text-gray-900">Novelty report</h2>
        <p class="text-sm text-gray-400 mt-0.5">
          Based on {totalRelatedWorks} related works across 4 aspects
        </p>
      </div>
      <button
        on:click={reset}
        class="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
      >
        Check another →
      </button>
    </div>
    {@html '<!--<NoveltyRecommendation recommendation={result.recommendation} />-->'}
    <NoveltyScore score={result.noveltyScore} verdict={result.verdict} />
    <NoveltyBreakdown aspects={result.aspects} />
  {/if}
</div>
