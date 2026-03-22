<script lang="ts">
  import TextInput from '$lib/components/FormInputs/TextInput.svelte';
  import LoadingButton from '$lib/components/FormInputs/LoadingButton.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import { resetPassword } from '$lib/api/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let password = '';
  let isLoading = false;
  let message = '';
  let alertType: 'success' | 'error' = 'error';

  // get query params from URL
  $: email = $page.url.searchParams.get('email') ?? '';
  $: otp = $page.url.searchParams.get('otp') ?? '';

  async function handleReset() {
    if (!email || !otp) {
      alertType = 'error';
      message = 'Invalid or expired reset link';
      return;
    }

    isLoading = true;
    message = '';

    try {
      await resetPassword(email, otp, password);

      alertType = 'success';
      message = 'Password reset successfully. Redirecting...';
      goto('/login');
    } catch (e: any) {
      alertType = 'error';
      message = e?.detail ?? 'Something went wrong';
    } finally {
      isLoading = false;
    }
  }
</script>

<form class="space-y-6" on:submit|preventDefault={handleReset}>
  {#if message}
    <Alert {message} type={alertType} />
  {/if}

  <TextInput label="New Password" name="password" type="password" bind:value={password} />

  <div>
    <LoadingButton label="Reset Password" loading={isLoading} />
  </div>
</form>
