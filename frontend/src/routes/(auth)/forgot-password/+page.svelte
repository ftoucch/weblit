<script lang="ts">
  import TextInput from '$lib/components/FormInputs/TextInput.svelte';
  import LoadingButton from '$lib/components/FormInputs/LoadingButton.svelte';
  import { requestPasswordReset } from '$lib/api/auth';

  let email = '';
  let isLoading = false;
  let message = '';
  let alertType: 'success' | 'error' = 'error';
  let emailSent = false;

  async function emailVerify() {
    isLoading = true;
    message = '';

    try {
      await requestPasswordReset(email);

      alertType = 'success';
      message = 'OTP has been sent';
      emailSent = true;
    } catch (e: any) {
      alertType = 'error';
      message = e?.detail ?? 'Something went wrong';
    } finally {
      isLoading = false;
    }
  }
</script>

<form class="space-y-6" on:submit|preventDefault={emailVerify}>
  {#if !emailSent}
    <TextInput label="Email" name="email" type="email" bind:value={email} />
    <div>
      <LoadingButton label="Submit" loading={isLoading} />
    </div>
  {:else}
    <div class="text-sm text-gray-600">
      <p>
        If an account exists for <strong>{email}</strong>, an OTP has been sent.
      </p>
      <p class="mt-2">Please check your inbox and follow the instructions.</p>
    </div>
  {/if}
</form>
