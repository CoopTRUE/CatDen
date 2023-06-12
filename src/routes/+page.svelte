<script lang="ts">
  export let data
  const { captcha } = data
  export let form
</script>

<svelte:head>
  <title>Login | The Cat Den</title>
  <meta name="description" content="Login to The Cat Den" />
</svelte:head>

<main>
  <form method="POST">
    <!-- eslint-disable svelte/no-at-html-tags My data is safe, I promise -->
    {@html captcha.data}
    <input type="hidden" name="captcha_id" value={captcha.id} />
    <input required type="text" name="captcha" placeholder="Captcha" />
    <input required type="text" name="username" placeholder="Username" />
    <button>Login</button>
    {#if form?.error}
      <p>{form.error}</p>
    {/if}
  </form>
</main>

<style lang="scss">
  main {
    display: grid;
    place-items: center;
  }
  form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    box-shadow: 0 0 1rem 0.5rem green;
  }
</style>
