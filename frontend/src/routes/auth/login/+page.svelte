<script lang='ts'>
    import TextInput from "$lib/components/FormInputs/TextInput.svelte";
    import LoadingButton from "$lib/components/FormInputs/LoadingButton.svelte";
    import GeneralError from "$lib/components/GeneralError.svelte";
    import { isAuthenticated } from "$lib/stores/auth";

    import { getMe, login } from "$lib/api/auth";
    import { auth } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
  import { onMount } from "svelte";

    let email = '';
    let password = ''
    let isLoading = false;
    let error = ''

    onMount(() => {
        if ($isAuthenticated) {
            goto('/');
        }
    })

    async function handleLogin() {
        isLoading = true;
        try {
            const tokens = await login(email, password);
            auth.setToken(tokens.accessToken);
            const user = await getMe(tokens.accessToken);
            auth.setUser(user);
            if (!user.isVerified) {
                await goto('verify-otp');
            } else {
                await goto('/dashboard');
            }
        } catch(e: any) {
            error = e?.detail ?? 'Something went wrong';
        } finally {
            isLoading = false;
        }
    }

</script>
<form class="space-y-6" on:submit|preventDefault={handleLogin}>
    <GeneralError message = {error} />
    <TextInput  label="Email" name="email" type="email" bind:value={email} />
    <TextInput  label="Password" name="password" type="password" error="" bind:value={password} />
    <div>
        <LoadingButton label="Sign in" loading={isLoading} />
    </div>
</form>
<div class="text-sm mt-5">
    <a href="/forgot-password" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
</div>
<p class="mt-5 text-sm/6 text-gray-500">
    Not a member?
<a href="register" class="font-semibold text-indigo-600 hover:text-indigo-500">Register</a>
</p>