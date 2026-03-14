<script lang="ts">
  import { auth, currentUser } from "$lib/stores/auth";
  import TextInput from "$lib/components/FormInputs/TextInput.svelte";
  import LoadingButton from "$lib/components/FormInputs/LoadingButton.svelte";
  import GeneralError from "$lib/components/GeneralError.svelte";
  import { resendOtp, verifyOtp } from "$lib/api/auth";
  import { goto } from '$app/navigation';

  let otp = '';
  let loading = false;
  let error = '';

  async function handleVerify() {
    
    const userId = $currentUser?.id;
    if (!userId) return;

    try {
      const res = await verifyOtp(userId, otp);
      goto('/');
    } catch (e: any) {
        error = e?.detail ?? 'Invalid OTP';
    } finally {
        loading = false;
    }
  }

  async function resendOtpRequest() {
    const userId = $currentUser?.id;
    if (!userId) return;
    loading = true;
    error = '';

    try {
      await resendOtp();
    } catch (e: any) {
      error = e?.detail ?? 'OTP not sent';
    } finally {
      loading = false;
    }
  }
</script>

<form class="space-y-6" on:submit|preventDefault={handleVerify}>
  <GeneralError message={error} />

  <TextInput
    label="OTP"
    name="otp"
    type="text"
    bind:value={otp}
  />

  <div>
    <LoadingButton label="Verify" loading={loading} />
  </div>
</form>

<p class="mt-5 text-sm text-gray-500">
  Didn't receive an OTP? <button class="font-semibold text-indigo-600 hover:text-indigo-500" on:click={resendOtpRequest}>Resend OTP</button>
</p>