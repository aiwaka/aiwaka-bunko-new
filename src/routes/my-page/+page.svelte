<script lang="ts">
  import { signOut } from "firebase/auth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import { getUserName } from "$lib/user";
  import {
    type DocumentRequest,
    deleteRequestInterface,
    setAllRequestByUser,
    modifyRequestInterface,
  } from "$lib/request";
  import type { DocumentContent } from "$lib/doc";
  import { setAllFavDocByUser } from "$lib/favorite";

  import ButtonUi from "@/components/ButtonUi.svelte";
  import ContentsListItem from "@/components/ContentsListItem.svelte";
  import RequestBudge from "@/components/RequestBudge.svelte";

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
    await deleteRequestInterface(ev.detail.id, requestList);
  };
  const modifyRequest = async (ev: CustomEvent<{ id: string }>) => {
    await modifyRequestInterface(ev.detail.id, requestList);
  };
</script>

<h1>{loginUserName}</h1>
<h2>お気に入り文書一覧</h2>
<div class="favorite-doc-container">
  {#each favDocList as doc (doc.urlStr)}
    <ContentsListItem item={doc} isFavorite={true} />
  {/each}
</div>
<!-- TODO: 自分のページにはソート機能がほしいかも -->
<h2>リクエスト一覧</h2>
<div class="request-container">
  {#each requestList as request (request.id)}
    <RequestBudge
      {request}
      showDocTitle={true}
      on:modify-request={modifyRequest}
      on:delete-request={deleteRequest}
    />
  {/each}
</div>

<h2>ログアウト</h2>
<ButtonUi on:click={logout}>ログアウト</ButtonUi>

<div class="foot-blank" />

<style>
  .favorite-doc-container {
    display: grid;
    grid-template-columns: repeat(3, 3fr);
    column-gap: 1rem;
    row-gap: 1rem;
    margin: 2rem 2%;
  }
  @media (max-width: 1024px) {
    .favorite-doc-container {
      grid-template-columns: repeat(2, 2fr);
    }
  }

  .request-container {
    display: grid;
    grid-template-columns: repeat(2, 3fr);
    column-gap: 1rem;
    row-gap: 1rem;
    margin: 2rem 2%;
  }
  @media (max-width: 1024px) {
    .request-container {
      grid-template-columns: 1fr;
    }
  }
  .foot-blank {
    margin: 4rem auto;
  }
</style>
