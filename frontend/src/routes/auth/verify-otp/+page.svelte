<script lang="ts">
  import { currentUser } from '$lib/stores/auth';
  import TextInput from '$lib/components/FormInputs/TextInput.svelte';
  import LoadingButton from '$lib/components/FormInputs/LoadingButton.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import { resendOtp, verifyOtp } from '$lib/api/auth';
  import { goto } from '$app/navigation';

  let otp = '';
  let isLoading = false;
  let message = '';
  let alertType: 'success' | 'error' = 'error';

  async function handleVerify() {
    isLoading = true;
    const userId = $currentUser?.id;
    if (!userId) return;

    try {
      const res = await verifyOtp(userId, otp);
      goto('/search');
    } catch (e: any) {
      alertType = 'error';
      message = e?.detail ?? 'Invalid OTP';
    } finally {
      isLoading = false;
    }
  }

  async function resendOtpRequest() {
    const userId = $currentUser?.id;
    if (!userId) return;
    isLoading = true;

    try {
      await resendOtp();
      alertType = 'success';
      message = 'OTP has been sent';
    } catch (e: any) {
      alertType = 'error';
      message = e?.detail ?? 'OTP not sent';
    } finally {
      isLoading = false;
    }
  }
</script>

<form class="space-y-6" on:submit|preventDefault={handleVerify}>
  <Alert {message} type={alertType} />

  <TextInput label="OTP" name="otp" type="text" bind:value={otp} />

  <div>
    <LoadingButton label="Verify" loading={isLoading} />
  </div>
</form>

<p class="mt-5 text-sm text-gray-500">
  Didn't receive an OTP? <button
    class="font-semibold text-indigo-600 hover:text-indigo-500"
    on:click={resendOtpRequest}>Resend OTP</button
  >
</p>
