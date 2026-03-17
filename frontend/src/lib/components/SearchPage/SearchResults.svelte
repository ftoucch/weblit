<script lang="ts">
  import type { Paper } from "$lib/types/researchPaper";

  export let papers: { paper: Paper; cached: boolean }[] = [];
  export let loading = false;
  export let total: number | null = null;
</script>

{#if loading || papers.length > 0}
  <div class="mt-8">
    <!-- Stats row -->
    {#if papers.length > 0}
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs text-gray-400">
          {#if total !== null}
            {total} results
          {:else}
            {papers.length} results so far…
          {/if}
        </p>
      </div>
    {/if}

    <!-- Table -->
    <div class="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
            <th class="text-left px-4 py-3 font-medium w-1/2">Paper</th>
            <th class="text-left px-4 py-3 font-medium">Authors</th>
            <th class="text-left px-4 py-3 font-medium">Year</th>
            <th class="text-left px-4 py-3 font-medium">Citations</th>
          </tr>
        </thead>
        <tbody>
          {#each papers as { paper, cached }, i}
            <tr
              class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              style="animation: fadeUp 0.25s ease both; animation-delay: {Math.min(i * 40, 400)}ms"
            >
              <!-- Title -->
              <td class="px-4 py-3 align-top">
                <div class="flex items-start gap-2">
                  <div>
                    {#if paper.sourceUrl}
                      <a
                        href={paper.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium text-gray-900 hover:text-weblit leading-snug line-clamp-2"
                      >
                        {paper.title}
                      </a>
                    {:else}
                      <p class="font-medium text-gray-900 leading-snug line-clamp-2">{paper.title}</p>
                    {/if}
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                      {#if paper.fieldOfStudy}
                        <span class="text-xs text-gray-400">{paper.fieldOfStudy}</span>
                      {/if}
                      {#if paper.hasFullText}
                        <span class="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded-full">
                          Full text
                        </span>
                      {/if}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Authors -->
              <td class="px-4 py-3 align-top text-xs text-gray-500 max-w-40">
                <p class="line-clamp-2">
                  {paper.authors.map((a) => a.name).join(', ') || '—'}
                </p>
              </td>

              <!-- Year -->
              <td class="px-4 py-3 align-top text-xs text-gray-500 whitespace-nowrap">
                {paper.year ?? '—'}
              </td>

              <!-- Citations -->
              <td class="px-4 py-3 align-top text-xs text-gray-500 whitespace-nowrap">
                {paper.citationCount!= null ? paper.citationCount : '—'}
              </td>
            </tr>
          {/each}

          <!-- Loading skeleton rows -->
          {#if loading}
            {#each Array(3) as _}
              <tr class="border-b border-gray-100 last:border-0 animate-pulse">
                <td class="px-4 py-3">
                  <div class="h-3 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div class="h-2 bg-gray-100 rounded w-1/2"></div>
                </td>
                <td class="px-4 py-3"><div class="h-2 bg-gray-100 rounded w-24"></div></td>
                <td class="px-4 py-3"><div class="h-2 bg-gray-100 rounded w-10"></div></td>
                <td class="px-4 py-3"><div class="h-2 bg-gray-100 rounded w-10"></div></td>
                <td class="px-4 py-3"><div class="h-2 bg-gray-100 rounded w-16"></div></td>
                <td class="px-4 py-3"><div class="h-2 bg-gray-100 rounded w-12"></div></td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<style>
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>