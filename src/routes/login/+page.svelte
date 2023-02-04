<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { signInWithEmailAndPassword, signOut } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";
  import { getUserName } from "@/lib/user";

  $: errorMessage = "";
  $: loggedIn = false;
  let loginUserName: null | string = null;
  $: loginUserName = loginUserName;
  $: passwordInput = "";
  $: emailInput = "";

  onMount(async () => {
    const userName = await getUserName();
    loggedIn = !!userName;
    if (userName !== null) {
      loginUserName = userName;
    }
  });

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
    <button class="login-button" on:click={login}>Login</button>
  </div>
{:else}
  <div class="login-name-display">
    {loginUserName}としてログインしています。
    <button on:click={logout}>Logout</button>
  </div>
{/if}

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
  button {
    border: 1px solid var(--main-font-color);
  }
</style>
