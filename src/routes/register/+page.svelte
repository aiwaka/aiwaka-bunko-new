<script lang="ts">
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { validators } from "$lib/utils";
  import { auth } from "$lib/firebase";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { createUserRecord, getUserName } from "$lib/user";
  import { onMount } from "svelte";

  interface FormSchema {
    [key: string]: string;
    name: string;
    belongs: string;
    email: string;
    password: string;
  }

  $: errorMessage = "";
  $: loggedIn = false;
  $: newUserName = "";
  $: newUserBelongs = "";
  $: newUserEmail = "";
  $: newUserPassword = "";

  const validateForm = (values: FormSchema): boolean => {
    // フォーム項目と適用するバリデーションを並べる.
    const validationSchema = [
      { prop: "name", type: "required" },
      { prop: "belongs", type: "required" },
      { prop: "email", type: "required" },
      { prop: "email", type: "email" },
      { prop: "password", type: "required" },
    ];

    let result = true;
    for (const schema of validationSchema) {
      // 一つでもfalseになればresultはfalseになる
      result &&= validators[schema.type](values[schema.prop]);
    }
    return result;
  };

  onMount(async () => {
    const userName = await getUserName();
    loggedIn = !!userName;
  });

  const registerUser = () => {
    const formValues: FormSchema = {
      name: newUserName,
      belongs: newUserBelongs,
      email: newUserEmail,
      password: newUserPassword,
    };
    if (!validateForm(formValues)) {
      // 引っかかったら終了させる
      errorMessage = "間違いがあります。";
      return;
    } else {
      errorMessage = "";
    }

    createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword)
      .then((cred) => {
        // アカウント登録情報を使ってデータベースに情報を登録
        const uid = cred.user.uid;
        createUserRecord(uid, newUserName, newUserBelongs);

        // リダイレクトを行う
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
        if (error.code === "auth/weak-password") {
          errorMessage = `パスワードが脆弱です。\n${error.message}`;
        } else {
          errorMessage = `登録処理中に何らかの問題が発生しました。\n${error.code}:${error.message}`;
        }
      });
  };
</script>

{#await getUserName()}
  <p>Loading...</p>
{:then userName}
  {#if !userName}
    <div class="register-form">
      <fieldset class:error-exist={errorMessage}>
        <label for="form-name">ハンドルネーム</label>
        <input id="form-name" type="text" placeholder="name" bind:value={newUserName} />
        <label for="form-belongs">所属</label>
        <input id="form-belongs" type="text" placeholder="belongs" bind:value={newUserBelongs} />
        <label for="form-email">メールアドレス</label>
        <input id="form-email" type="email" placeholder="email" bind:value={newUserEmail} />
        <label for="form-password">パスワード</label>
        <input
          id="form-password"
          type="password"
          placeholder="password"
          bind:value={newUserPassword}
        />
        <button on:click={registerUser}>Register</button>
      </fieldset>
    </div>
    {#if errorMessage}
      <div class="error-msg error-exist">
        {errorMessage}
      </div>
    {/if}
  {:else}
    <p>ログイン済みです。</p>
  {/if}
{:catch error}
  <div class="error-msg error-exist">
    <p>ユーザーの読み込み中にエラーが発生しました。</p>
    <p>{error}</p>
  </div>
{/await}

<style>
  .error-exist {
    border: 2px solid red;
  }
  .error-msg {
    color: red;
  }
  fieldset {
    display: grid;
    grid-template-rows: repeat(2, 2rem) 1fr;
    grid-template-columns: 22rem 1fr;
    row-gap: 2.4rem;
    column-gap: 0.7rem;
    width: 97%;
    margin: 2rem auto;
    padding: 1.6rem 2rem;
  }
  label {
    line-height: 2rem;
    margin-right: 0.7rem;
  }

  input {
    color: inherit;
    background-color: transparent;
    border: 1px solid #777;
    transition: ease-in-out 0.2s;
  }
  input:focus {
    outline-width: 0;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(1.5rem);
  }

  button {
    grid-column-start: 2;
    width: fit-content;
    height: 3rem;
    justify-self: right;

    padding: 0.2rem 0.7rem;
    border: 2px solid #999;
    border-radius: 5px;
    background-color: transparent;
    cursor: pointer;
  }
  button:hover,
  button:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(1.5rem);
  }
  @media (max-width: 1024px) {
    fieldset {
      grid-template-rows: repeat(5, 2rem);
      grid-template-columns: 1fr;
      row-gap: 1.2rem;
    }
    label {
      grid-column-start: 1;
    }
    button {
      grid-column-start: 1;
    }
  }
</style>
