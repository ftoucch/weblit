<script lang="ts">
  export let message: string = '';
</script>

{#if message}
  <div
    class="bg-red-50 border text-sm border-red-100 text-red-400 px-3 py-2 rounded relative animate-slide-fade"
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