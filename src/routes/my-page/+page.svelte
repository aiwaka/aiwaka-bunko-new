<script lang="ts">
  import { signOut } from "firebase/auth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import { getUserName } from "$lib/user";
  import {
    type DocumentRequest,
    deleteRequestFromList,
    setAllRequestByUser,
    modifyRequestInList,
  } from "$lib/request";
  import type { DocumentContent } from "$lib/doc";
  import { setAllFavDocByUser } from "$lib/favorite";

  import ButtonUi from "@/components/ButtonUi.svelte";
  import ContentsListContainer from "@/components/ContentsListContainer.svelte";
  import RequestContainer from "@/components/RequestContainer.svelte";

  $: errorMessage = "";
  let favDocList: DocumentContent[];
  $: favDocList = [];
  $: loginUserName = "";
  let requestList: DocumentRequest[];
  $: requestList = [];

  onMount(async () => {
    const userName = await getUserName();
    if (userName) {
      loginUserName = userName;
      // お気に入り情報を取得
      setAllFavDocByUser(favDocList).then(() => {
        // Svelteのリアクティブ変数のために再代入処理
        favDocList = favDocList;
      });
      // リクエスト情報を取得
      setAllRequestByUser(requestList).then(() => {
        requestList = requestList;
      });
    }
  });

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
  const deleteRequest = async (ev: CustomEvent<{ id: string }>) => {
    requestList = await deleteRequestFromList(ev.detail.id, requestList);
  };
  const modifyRequest = async (ev: CustomEvent<{ id: string }>) => {
    await modifyRequestInList(ev.detail.id, requestList);
    requestList = requestList;
  };
</script>

<h1>{loginUserName}</h1>

<h2>お気に入り文書一覧</h2>
<ContentsListContainer documentList={favDocList} favList={"all"} />

<!-- TODO: 自分のページにはソート機能がほしいかも -->
<h2>リクエスト一覧</h2>
<RequestContainer
  {requestList}
  showDocTitle={true}
  on:modify-request={modifyRequest}
  on:delete-request={deleteRequest}
/>
{#if errorMessage}
  <div class="error-message">{errorMessage}</div>
{/if}

<h2>ログアウト</h2>
<ButtonUi on:click={logout}>ログアウト</ButtonUi>

<div class="foot-blank" />

<style>
  .error-message {
    color: red;
    border: 1px solid red;
  }
  .foot-blank {
    margin: 4rem auto;
  }
</style>
