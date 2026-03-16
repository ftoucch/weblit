<script lang="ts">
  import { onDestroy } from 'svelte';

  export let message: string = '';
  export let type: 'success' | 'error' = 'error';
  export let duration = 4000;

  const styles = {
    success: 'bg-green-50 border-green-100 text-green-500',
    error: 'bg-red-50 border-red-100 text-red-400',
  };

  let timeout: ReturnType<typeof setTimeout>;

  $: if (message) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      message = '';
    }, duration);
  }

  onDestroy(() => clearTimeout(timeout));
</script>

{#if message}
  <div
    class={`border text-sm px-3 py-2 rounded relative animate-slide-fade ${styles[type]}`}
    role="alert"
  >
    {message}
  </div>
{/if}

<style>
  @keyframes slideFade {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slide-fade {
    animation: slideFade 0.3s ease-out forwards;
  }
</style>
