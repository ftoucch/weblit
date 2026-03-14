<script>
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { isVerified } from "$lib/stores/auth";
import { onMount } from 'svelte';

const email = $page.url.searchParams.get('email') ?? '';

onMount(() => {
    if ($isVerified) {
		goto('/search');
	} else {
		goto('auth/login');
	}
})
</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
