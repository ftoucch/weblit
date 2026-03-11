<script>
    import TextInput from "$lib/components/FormInputs/TextInput.svelte";
    import LoadingButton from "$lib/components/FormInputs/LoadingButton.svelte";
    let loading = false
</script>
<form class="space-y-6" method="post">
      <TextInput  label="OTP" name="otp" type="text" />
      <div>
        <LoadingButton label="Sign in" {loading} />
      </div>
</form>
