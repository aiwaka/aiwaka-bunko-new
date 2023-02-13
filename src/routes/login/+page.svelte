<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { signInWithEmailAndPassword, signOut } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import { getUserName } from "$lib/user";
  import ButtonUi from "@/components/ButtonUi.svelte";

  $: errorMessage = "";
  $: passwordInput = "";
  $: emailInput = "";

  const login = () => {
    signInWithEmailAndPassword(auth, emailInput, passwordInput)
      .then(() => {
        if ($page.url.searchParams.get("redirect")) {
          const redirect = $page.url.searchParams.get("redirect");
          if (typeof redirect === "string") {
            goto(`/${redirect}`, { replaceState: true });
          } else {
            goto("/");
          }
        } else {
          goto("/");
        }
      })
      .catch((error) => {
        const code = error.code;
        const message = error.message;
        errorMessage = `${code}:${message}`;
      });
  };
  const logout = () => {
    if (confirm("ログアウトしますか？")) {
      signOut(auth)
        .then(() => {
          goto("/");
        })
        .catch((error) => {
          errorMessage = error.message;
        });
    }
  };
</script>

{#await getUserName()}
  <p>Loading...</p>
{:then userName}
  {@const loggedIn = !!userName}
  {#if !loggedIn}
    <div class="login-form">
      <label for="login-email-input">e-mail</label>
      <input id="login-email-input" placeholder="name" bind:value={emailInput} />
      <label for="login-password-input">password</label>
      <input
        id="login-password-input"
        placeholder="password"
        type="password"
        bind:value={passwordInput}
      />
      <div class="login-button">
        <ButtonUi on:click={login}>Login</ButtonUi>
      </div>
    </div>
  {:else}
    <div class="login-name-display">
      {userName}としてログインしています。
      <ButtonUi on:click={logout}>Logout</ButtonUi>
    </div>
  {/if}
{:catch error}
  <div class="error-msg">
    <p>ユーザーの読み込み中にエラーが発生しました。</p>
    <p>{error}</p>
  </div>
{/await}

{#if errorMessage}
  <div class="error-msg">
    {errorMessage}
  </div>
{/if}

<style>
  .login-form {
    margin: 1rem auto;
    width: 70%;
    display: grid;
    grid-template-columns: 6rem 6rem 3rem;
    row-gap: 1rem;
  }
  @media (max-width: 1024px) {
    .login-form {
      width: 80%;
    }
  }
  .login-form > input {
    grid-column: 2 / -1;
  }
  .login-button {
    grid-column: -2 / -1;
  }
</style>
