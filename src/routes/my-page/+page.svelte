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
  import { setPreviousDate } from "$lib/utils";

  import ButtonUi from "@/components/ButtonUi.svelte";

  $: errorMessage = "";
  let favDocList: DocumentContent[];
  $: favDocList = [];
  $: lastWeekDate = new Date();
  $: loginUserName = "";
  let requestList: DocumentRequest[];
  $: requestList = [];

  // components: { RequestBudgeVue, ContentsListItemVue, ButtonUiVue },

  onMount(async () => {
    setPreviousDate(lastWeekDate);
    const userName = await getUserName();
    if (userName) {
      loginUserName = userName;
      // お気に入り情報を取得
      await setAllFavDocByUser(favDocList);
      // リクエスト情報を取得
      await setAllRequestByUser(requestList);
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
  const deleteRequest = async (id: string) => {
    deleteRequestInterface(id, requestList);
  };
  const modifyRequest = async (id: string) => {
    modifyRequestInterface(id, requestList);
  };
</script>

<h1>{{ loginUserName }}</h1>
<h2>お気に入り文書一覧</h2>
<div class="favorite-doc-container">
  {#each favDocList as doc (doc.urlStr)}
    {doc}
  {/each}
  <!-- <contents-list-item-vue
      v-for="doc in favDocList"
      :key="doc.urlStr"
      :item="doc"
      :favorite="true"
      :last-week-date="lastWeekDate"
    /> -->
</div>
<!-- TODO: 自分のページにはソート機能がほしいかも -->
<h2>リクエスト一覧</h2>
<div class="request-container">
  {#each requestList as req (req.id)}
    {req}
  {/each}
  <!-- <request-budge-vue
      v-for="req in requestList"
      :key="req.id"
      :request="req"
      :show-doc-title="true"
      @modify-request="modifyRequest"
      @delete-request="deleteRequest"
    /> -->
</div>

<h2>ログアウト</h2>
<ButtonUi on:click={logout}>ログアウト</ButtonUi>

<style>
  .favorite-doc-container {
    display: grid;
    grid-template-columns: repeat(3, 3fr);
    margin: 2rem 3%;
  }
  @media (max-width: 1024px) {
    .favorite-doc-container {
      grid-template-columns: repeat(2, 2fr);
    }
  }

  .request-container {
    display: grid;
    grid-template-columns: repeat(3, 3fr);
  }
  @media (max-width: 1024px) {
    .request-container {
      grid-template-columns: 1fr;
    }
  }
</style>
