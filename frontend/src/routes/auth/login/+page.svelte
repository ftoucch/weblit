<script>
    import TextInput from "$lib/components/FormInputs/TextInput.svelte";
    import LoadingButton from "$lib/components/FormInputs/LoadingButton.svelte";
    let loading = false
</script>
<form class="space-y-6" method="post">
      <TextInput  label="Email" name="email" type="email" />
      <TextInput  label="Password" name="password" type="email" error="" />
      <div>
        <LoadingButton label="Sign in" {loading} />
      </div>
</form>
<div class="text-sm mt-5">
    <a href="/forgot-password" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
</div>
<p class="mt-5 text-sm/6 text-gray-500">
    Not a member?
<a href="register" class="font-semibold text-indigo-600 hover:text-indigo-500">Register</a>
</p>