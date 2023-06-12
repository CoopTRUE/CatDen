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
  <h1>THE CAT DEN1</h1>
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
  h1 {
    font-size: 5rem;
    font-weight: 900;
  }
  main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
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
