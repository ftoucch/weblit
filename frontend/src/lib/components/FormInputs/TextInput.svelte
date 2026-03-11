<script lang="ts">
  export let label: string
  export let name: string
  export let type: string
  export let value: string = ''
  export let placeholder: string = ''
  export let error: string| undefined = undefined
</script>

<div>
  <div class="flex items-center justify-between">
    <label for={name} class="block text-sm/6 font-medium text-gray-900">
      {label}
    </label>
  </div>

  <div class="mt-2">
    <input
      type={type}
      name={name}
      id={name}
      bind:value
      placeholder={placeholder}
      autocomplete="current-password"
      required
      class="block w-full rounded-sm bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-freductive-600 sm:text-sm/6 h-10"
    />
  </div>

  {#if error}
    <div class="mt-5 form-error text-xs text-red-500">{error}</div>
  {/if}
</div>