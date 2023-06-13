<script lang="ts">
  export let data
  const { captcha } = data
  const src = `data:image/svg+xml;base64,${captcha.data}`
  export let form
</script>

<svelte:head>
  <title>Login | The Cat Den</title>
  <meta name="description" content="Login to The Cat Den" />
</svelte:head>

<main>
  <h1>THE CAT DEN</h1>
  <form method="POST">
    <img {src} alt="Captcha" />
    <input type="hidden" name="captcha_id" value={captcha.id} />
    <input required type="text" name="captcha" placeholder="Captcha" />
    <input required type="text" name="username" placeholder="Username" />
    <button>Login</button>
    {#if form?.error}
      <p>{form.error}</p>
    {/if}
  </form>
  <p>This site does not contain javascript.<br />Lower security if the captcha does not load.</p>
</main>

<style lang="scss">
  h1 {
    font-size: 4rem;
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
    transition: all 0.5s ease;
    // &:has(input:focus, input:hover) {
    //   box-shadow: 0 0 1rem 0.5rem green;
    // }
    // &:has(button:focus, button:hover) {
    //   box-shadow: 0 0 1.5rem 2rem green;
    // }
    // tor doesn't support :has
    box-shadow: 0 0 1rem 0.5rem green;
  }
  p {
    width: 40ch;
    text-align: center;
  }
</style>
