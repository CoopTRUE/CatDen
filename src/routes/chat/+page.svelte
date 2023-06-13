<script lang="ts">
  export let data
  const { userId, users } = data
</script>

<main>
  <div class="chatroom">
    <header>
      <h1>You are logged in as {users.get(userId)?.username || 'ERROR'}</h1>
      <form method="POST" action="?/logout">
        <button>Logout</button>
      </form>
    </header>
    <div class="messages">
      {#each [...users] as [id, user]}
        {#each [...user.chats.values()] as message}
          <div class="message" class:self={id === userId}>
            <span class="username" style:color={`hsl(${user.colorHue}, 100%, 70%)`}>
              {user.username}
            </span>
            <span class="content">
              <!-- eslint-disable svelte/no-at-html-tags DOMParser works wonders -->
              {@html message}
            </span>
          </div>
        {/each}
      {/each}
    </div>
    <form action="?/message" method="POST" class="message-form">
      <input type="hidden" name="userId" value={userId} />
      <input type="text" name="message" placeholder="Type your message..." />
      <button>Send</button>
    </form>
  </div>
</main>

<style lang="scss">
  .chatroom {
    display: grid;
    grid-template-rows: auto 1fr 50px;
  }
  header {
    background-color: #2e2e2e;
    padding: 10px;
    text-align: center;
    font-size: 20px;
    border-bottom: 1px solid #404040;
  }

  .messages {
    padding: 10px;
    overflow-y: scroll;
    .message {
      .username {
        font-weight: bold;
        &::after {
          content: ':';
        }
      }
      &.self {
        background-color: #404040;
      }
    }
  }

  .message-form {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #404040;
    padding: 10px;

    input {
      flex: 1;
      margin-right: 10px;
      padding: 5px;
      border: none;
      border-radius: 5px;
    }

    button {
      padding: 5px 10px;
      border: none;
      border-radius: 5px;
      color: #cfcfcf;
      background-color: #404040;
      cursor: pointer;

      &:hover {
        background-color: #505050;
      }
    }
  }
</style>
