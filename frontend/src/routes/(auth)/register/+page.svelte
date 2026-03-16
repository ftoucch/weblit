<script lang="ts">
  import TextInput from '$lib/components/FormInputs/TextInput.svelte';
  import LoadingButton from '$lib/components/FormInputs/LoadingButton.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import { login, register } from '$lib/api/auth';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';

  let name = '';
  let email = '';
  let password = '';
  let isLoading = false;
  let message = '';
  let alertType: 'success' | 'error' = 'error';

  async function handleRegister() {
    isLoading = true;
    try {
      const user = await register({ name, email, password });
      const tokens = await login(email, password);
      auth.setToken(tokens.accessToken);
      if (user) {
        auth.setUser(user);
        await goto('verify-otp');
      }
    } catch (e: any) {
      alertType = 'error';
      message = e?.detail ?? 'Something went wrong';
    } finally {
      isLoading = false;
    }
  }
</script>

<form class="space-y-6" on:submit|preventDefault={handleRegister}>
  <Alert {message} type={alertType} />
  <TextInput label="Name" name="name" type="text" bind:value={name} />
  <TextInput label="Email" name="email" type="email" bind:value={email} />
  <TextInput label="Password" name="password" type="password" bind:value={password} />
  <div>
    <LoadingButton label="Register" loading={isLoading} />
  </div>
</form>
<div class="text-sm mt-5">
  <a href="/forgot-password" class="font-semibold text-indigo-600 hover:text-indigo-500"
    >Forgot password?</a
  >
</div>
<p class="mt-5 text-sm/6 text-gray-500">
  Already a member?
  <a href="login" class="font-semibold text-indigo-600 hover:text-indigo-500">Login</a>
</p>
