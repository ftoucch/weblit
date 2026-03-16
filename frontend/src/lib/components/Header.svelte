<script lang="ts">
  import { page } from '$app/stores';
  import { navigation, userNavigation } from '$lib/utils/navigation';
  import { currentUser } from '$lib/stores/auth';

  let mobileOpen = false;
  let profileOpen = false;

  function toggleMobile() { mobileOpen = !mobileOpen; }
  function toggleProfile() { profileOpen = !profileOpen; }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#profile-menu')) {
      profileOpen = false;
    }
  }

  function isActive(href: string): boolean {
    return $page.url.pathname === href;
  }

  function signout() {
    const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
    fetch('/logout', { method: 'DELETE', headers: { 'X-CSRF-TOKEN': token } })
      .then(() => { window.location.href = '/'; });
  }
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="bg-white border-b border-gray-200">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between">

      <!-- Left: Logo + nav links -->
      <div class="flex items-center">
        <div class="shrink-0 flex items-center space-x-4 pr-1.5">
          <h2 class="text-black text-l font-semibold">Weblit</h2>
        </div>

        <!-- Desktop nav links -->
        <div class="hidden md:flex ml-50 items-baseline space-x-15">
          {#each navigation as item}
            <a
                href={item.href}
                class="py-5 text-xs text-black border-b-2 flex items-center gap-1.5 {isActive(item.href) ? 'border-weblit-600' : 'border-transparent hover:border-weblit hover:text-weblit'}"
                aria-current={isActive(item.href) ? 'page' : undefined}
            >
                <svelte:component this={item.icon} size="14" />
                {item.name}
            </a>
          {/each}
        </div>
      </div>

      <div class="hidden md:flex items-center gap-4">
        <!-- Profile dropdown -->
        <div id="profile-menu" class="relative">
          <button
            on:click|stopPropagation={toggleProfile}
            aria-label="Open user menu"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            class="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-weblit-500"
          >
            <!-- img with descriptive alt satisfies the a11y label requirement on this button -->
            <div class="size-8 rounded-full bg-weblit flex items-center justify-center text-white text-sm font-semibold">
                {$currentUser?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div class="ml-3">
                <div class="text-xs text-gray-500">{$currentUser?.email}</div>
            </div>
          </button>

          {#if profileOpen}
            <div
              role="menu"
              aria-label="User menu"
              class="absolute top-10 right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5"
            >
              {#each userNavigation as item}
                <a href={item.href} role="menuitem" class="block px-4 py-2 text-sm text-black hover:bg-gray-100">
                  {item.name}
                </a>
              {/each}
              <button
                on:click={signout}
                role="menuitem"
                class="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          {/if}
        </div>
      </div>

      <!-- Mobile hamburger -->
      <div class="-mr-2 flex md:hidden">
        <button
          on:click={toggleMobile}
          aria-label={mobileOpen ? 'Close main menu' : 'Open main menu'}
          aria-expanded={mobileOpen}
          class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-black focus:outline-2 focus:outline-offset-2 focus:outline-weblit-500"
        >
          {#if mobileOpen}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          {/if}
        </button>
      </div>

    </div>
  </div>

  <!-- Mobile menu panel -->
  {#if mobileOpen}
    <div class="md:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
        {#each navigation as item}
          <a
            href={item.href}
            class="block rounded-md px-3 py-2 text-base font-medium {isActive(item.href) ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-100'}"
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.name}
          </a>
        {/each}
      </div>

      <div class="border-t border-gray-200 pt-4 pb-3">
        <div class="flex items-center px-5">
            <div class="size-10 rounded-full bg-weblit flex items-center justify-center text-white text-base font-semibold">
                {$currentUser?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
          <div class="ml-3">
            <div class="text-base font-medium text-black">{$currentUser?.name}</div>
            <div class="text-sm text-gray-500">{$currentUser?.email}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1 px-2">
          {#each userNavigation as item}
            <a href={item.href} class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
              {item.name}
            </a>
          {/each}
          <button
            on:click={signout}
            class="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  {/if}
</nav>