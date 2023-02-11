<script lang="ts">
  import ButtonUi from "@/components/ButtonUi.svelte";
  import DesignedPin from "@/components/DesignedPin.svelte";
  import NewItemIcon from "@/components/NewItemIcon.svelte";
  import RequestBudge from "@/components/RequestBudge.svelte";
  import { getContent, type DocumentContent } from "@/lib/doc";
  import {
    createFavoriteToFirestore,
    deleteFavoriteFromFirestore,
    getIfDocInFavorite,
  } from "@/lib/favorite";
  import {
    createRequestToFirestore,
    deleteRequestInterface,
    modifyRequestInterface,
    setRequestByUserAndTarget,
    type DocumentRequest,
    requestTypeStrList,
  } from "@/lib/request";
  import { downloadDocument, openFileAsNewTab, setPreviousDate } from "@/lib/utils";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  const documentId = data.documentId;
  let documentItem: DocumentContent | null;
  $: documentItem = null;
  $: isFavorite = false;
  const lastWeekDate = new Date();
  setPreviousDate(lastWeekDate);
  $: newRequestMessage = "";
  $: newRequestType = 0;
  let requestList: DocumentRequest[];
  $: requestList = [];
  $: addButtonDisabled = newRequestType !== 2 && newRequestMessage === "";

  onMount(async () => {
    // 文書情報を取得
    const item = await getContent(documentId);
    documentItem = item;
    // リクエスト情報を取得
    await setRequestByUserAndTarget(requestList, documentId);
    // お気に入りかどうか取得
    const favFlag = await getIfDocInFavorite(documentId);
    if (favFlag === undefined) {
      console.log("error: favorite flag is undefined.");
    } else {
      isFavorite = favFlag;
    }
  });

  // ダウンロードする関数を包んで引数なしの関数を作りコールバックとして渡す.
  const downloadOpenTab = () => {
    openFileAsNewTab(documentId);
  };
  const downloadDirect = () => {
    downloadDocument(documentId);
  };

  const addRequest = async () => {
    if (newRequestType !== 2 && newRequestMessage === "") {
      alert("修正依頼または意見を送る場合はメッセージが必須です。");
    }
    if (documentItem) {
      const addedRequest = await createRequestToFirestore(
        newRequestType,
        documentId,
        documentItem?.title,
        newRequestMessage
      );
      if (addedRequest) {
        requestList.push(addedRequest);
        newRequestType = 0;
        newRequestMessage = "";
      }
    }
  };

  const modifyRequest = async (ev: CustomEvent<{ id: string }>) => {
    await modifyRequestInterface(ev.detail.id, requestList);
  };
  const deleteRequest = async (ev: CustomEvent<{ id: string }>) => {
    await deleteRequestInterface(ev.detail.id, requestList);
  };

  // 一つでもあればfavに入っているので, 作るときはひとつ作り, 消すときはすべて消すようにする.
  const addToFavorite = () => {
    if (documentItem !== null) {
      createFavoriteToFirestore(documentId, documentItem.title);
      isFavorite = true;
    }
  };
  const removeFromFavorite = () => {
    deleteFavoriteFromFirestore(documentId);
    isFavorite = false;
  };
  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorite();
    } else {
      addToFavorite();
    }
  };
</script>

{#if documentItem !== null}
  <h1>{documentItem.title}</h1>
  <p class="update-timestamp">
    last update : {documentItem.postDateAsString()}
    {#if documentItem.update.toDate() > lastWeekDate}
      <NewItemIcon />
    {/if}
  </p>

  <h2>概要</h2>
  <p>{documentItem.description}</p>
  {#if documentItem.notes.length !== 0}
    <h2>注意</h2>
    {#each documentItem.notes as note}
      <ul class="note-list">
        {note}
      </ul>
    {/each}
  {/if}

  <h2>ダウンロード</h2>
  <div class="button-container">
    <ButtonUi on:click={downloadOpenTab}>新しいタブで開く</ButtonUi>
    <ButtonUi on:click={downloadDirect}>ファイルをダウンロード</ButtonUi>
  </div>

  <h2>お気に入り登録</h2>
  <div class="favorite-container">
    <DesignedPin on:click={toggleFavorite} active={isFavorite} />
    {#if isFavorite}
      <div class="favorite-status-text">
        <span>登録済み</span>
      </div>
    {/if}
  </div>

  <h2>リクエスト</h2>
  <p>
    文書の修正等を行いたい場合は、ここでリクエストを行ってください。
    継続的に参加したい、または自分で修正を行いたい場合はGitHubリポジトリへの参加申請を行ってください。
  </p>
  <h3>追加</h3>
  <p>
    リクエスト内容を記入して追加してください。 メッセージは、GitHub参加依頼の場合は必要ありません。
  </p>
  <div class="add-request-form">
    <fieldset class="add-request-form-field">
      <label for="request-type"> タイプ </label>
      <select id="request-type" name="type" bind:value={newRequestType}>
        {#each requestTypeStrList as type, index (type)}
          <option value={index}>{type}</option>
        {/each}
      </select>
      <label for="request-message"> メッセージ </label>
      <input
        id="request-message"
        type="text"
        name="message"
        placeholder="message"
        bind:value={newRequestMessage}
      />
      <div class="add-button">
        <ButtonUi on:click={addRequest} disabled={addButtonDisabled}>追加</ButtonUi>
      </div>
    </fieldset>
  </div>
  <h3>これまでのリクエスト一覧</h3>
  <div class="request-container">
    {#each requestList as request (request.id)}
      <RequestBudge
        {request}
        showDocTitle={false}
        on:modify-request={modifyRequest}
        on:delete-request={deleteRequest}
      />
    {/each}
  </div>
{/if}

<style>
  .button-container {
    display: flex;
    margin: 1.2rem 1rem;
  }

  .favorite-container {
    display: flex;
    padding: 0.5rem auto;
  }
  .favorite-status-text {
    margin-left: 0.8rem;
  }
  .favorite-status-text > span {
    color: rgba(orange, 0.8);
  }
  .note-list::before {
    content: "・";
  }

  fieldset.add-request-form-field {
    display: grid;
    grid-template-rows: repeat(2, 2.8rem) 1fr;
    grid-template-columns: 8rem 1fr;
    row-gap: 2rem;
    column-gap: 0.7rem;
    width: 97%;
    margin: 2rem auto;
    padding: 1.6rem 2rem;
  }
  @media (max-width: 1024px) {
    fieldset.add-request-form-field {
      grid-template-rows: repeat(5, 2.8rem);
      grid-template-columns: 1fr;
      row-gap: 1.2rem;
    }
    .add-button {
      grid-column-start: 1;
    }
    .request-container {
      grid-template-columns: 1fr;
    }
  }

  label {
    line-height: 2.8rem;
    margin-right: 0.7rem;
  }

  input {
    color: inherit;
    background-color: transparent;
    border: 1px solid #888;
    transition: ease-in-out 0.2s;
  }
  input:focus {
    outline-width: 0;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(1.5rem);
  }

  select {
    color: inherit;
    background-color: transparent;
    border: 1px solid #888;
    transition: ease-in-out 0.2s;
  }
  select:focus {
    outline-width: 0;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(1.5rem);
  }

  .add-button {
    grid-column-start: 2;
    justify-self: right;
  }

  .request-container {
    display: grid;
    grid-template-columns: repeat(3, 3fr);
  }
</style>
