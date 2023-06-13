<script lang="ts">
  import type { SuperMessage } from '$lib/types.js'

  export let data
  const { localUserId, users } = data
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const localUser = users.get(localUserId)!

  const orderedMessages: SuperMessage[] = []
  for (const [userId, user] of users) {
    for (const message of user.messages) {
      orderedMessages.push({ ...message, ...user, userId })
    }
  }
  orderedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  function timeUntil(milliseconds: number) {
    const duration = milliseconds - Date.now()
    const seconds = Math.floor(duration / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `in ${days} day(s)`
    } else if (hours > 0) {
      return `in ${hours} hour(s)`
    } else if (minutes > 0) {
      return `in ${minutes} minute(s)`
    } else if (seconds > 0) {
      return `in ${seconds} second(s)`
    } else {
      return 'now'
    }
  }
</script>

<svelte:head>
  <!-- refresh every 5 seconds -->
  <meta http-equiv="refresh" content="15" />
</svelte:head>
<main>
  <div class="chatroom">
    <header>
      <h1>
        You are logged in as <span style:color="hsl({localUser.colorHue}, 100%, 70%)">
          {localUser.username}
        </span>
      </h1>
      <form method="POST" action="?/logout">
        <p>
          Your account will be automatically deleted {timeUntil(localUser.expiresAt.getTime())}
        </p>
        <input type="hidden" name="userId" value={localUserId} />
        <button>Logout</button>
      </form>
    </header>
    <div class="messages">
      {#each orderedMessages as { userId, colorHue, username, message }}
        <div class="message" class:self={userId === localUserId}>
          <span class="username" style:color="hsl({colorHue}, 100%, 70%)">
            {username}
          </span>
          <span class="content">
            <!-- eslint-disable svelte/no-at-html-tags DOMParser works wonders -->
            {@html message}
          </span>
        </div>
      {/each}
    </div>
    <form action="?/message" method="POST" class="message-form">
      <input type="hidden" name="userId" value={localUserId} />
      <!-- svelte-ignore a11y-autofocus -->
      <input type="text" name="message" placeholder="Type your message..." autofocus={true} />
      <button>Send</button>
    </form>
  </div>
  <div class="countdown">
    <span class="inner" />
  </div>
  <a href="/refresh" class="manual-refresh">MANUALLY REFRESH</a>
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
    height: 500px;
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
  @keyframes countdown2 {
    0% {
      content: '15';
    }
    6.6666666667% {
      content: '14';
    }
    13.3333333333% {
      content: '13';
    }
    20% {
      content: '12';
    }
    26.6666666667% {
      content: '11';
    }
    33.3333333333% {
      content: '10';
    }
    40% {
      content: '9';
    }
    46.6666666667% {
      content: '8';
    }
    53.3333333333% {
      content: '7';
    }
    60% {
      content: '6';
    }
    66.6666666667% {
      content: '5';
    }
    73.3333333333% {
      content: '4';
    }
    80% {
      content: '3';
    }
    86.6666666667% {
      content: '2';
    }
    93.3333333333% {
      content: '1';
    }
    100% {
      content: '0';
    }
  }
  @keyframes countdown {
    0% {
      content: ' 10';
    }
    10% {
      content: ' 9';
    }
    20% {
      content: ' 8';
    }
    30% {
      content: ' 7';
    }
    40% {
      content: ' 6';
    }
    50% {
      content: ' 5';
    }
    60% {
      content: ' 4';
    }
    70% {
      content: ' 3';
    }
    80% {
      content: ' 2';
    }
    90% {
      content: ' 1';
    }
    100% {
      content: ' 0';
    }
  }
  .countdown {
    text-align: center;
    &::before {
      content: 'Time until next refresh: ';
    }
    .inner::before {
      content: ' 10';
      animation: countdown2 15s steps(15) forwards;
    }
    &::after {
      content: 's';
    }
  }
  .manual-refresh {
    display: block;
    text-align: center;
    margin-top: 10px;
    color: #cfcfcf;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
