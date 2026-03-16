<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import Header from '$lib/components/Header.svelte';

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<main>
  <Header />
  <section class="flex flex-col justify-center">
    {@render children()}
  </section>
</main>
