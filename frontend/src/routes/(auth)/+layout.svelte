<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main class="h-full bg-white">
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm mb-5">
      <h2 class="text-center text-2xl/9 font-bold tracking-tight text-gray-900">Weblit</h2>
    </div>

    <div
      class="py-10 sm:mx-auto sm:w-full sm:max-w-sm px-4 border border-solid border-gray-200 rounded-sm"
    >
      {@render children()}
    </div>
  </div>
</main>
