<script lang="ts">
 export let label: string
 export let loading: boolean = false
</script>
<button
  type="submit"
  class="flex w-full items-center gap-2 justify-center cursor-pointer rounded-sm bg-weblit px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-weblit-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 h-10"
  disabled={loading}
>
  {#if loading}
    <div class="btn-spinner"></div>
    {:else}
      {label}
  {/if}
</button>