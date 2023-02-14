<script lang="ts">
  import ButtonUi from "@/components/ButtonUi.svelte";
  import DesignedPin from "@/components/DesignedPin.svelte";
  import NewItemIcon from "@/components/NewItemIcon.svelte";
  import RequestContainer from "@/components/RequestContainer.svelte";
  import { getContent, type DocumentContent } from "@/lib/doc";
  import {
    createFavoriteToFirestore,
    deleteFavoriteFromFirestore,
    getIfDocInFavorite,
  } from "@/lib/favorite";
  import {
    createRequestToFirestore,
    deleteRequestFromList,
    modifyRequestInList,
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
  $: messagePlaceholder = "";
  $: {
    switch (newRequestType) {
      case 0:
        messagePlaceholder = "○頁のx行目は△がいい。";
        break;
      case 1:
        messagePlaceholder = "○頁のx行目は正しくは△。";
        break;
      case 2:
        messagePlaceholder = "";
        break;
      case 3:
        messagePlaceholder = "message";
        break;
      default:
        messagePlaceholder = "例外状態になっています。管理者に問い合わせてください。";
        break;
    }
  }

  onMount(() => {
    // 文書情報を取得
    getContent(documentId).then((item) => {
      documentItem = item;
    });
    // リクエスト情報を取得
    setRequestByUserAndTarget(requestList, documentId).then(() => {
      requestList = requestList;
    });
    // お気に入りかどうか取得
    getIfDocInFavorite(documentId).then((favFlag) => {
      if (favFlag === undefined) {
        console.log("error: favorite flag is undefined.");
      } else {
        isFavorite = favFlag;
      }
    });
  });

  const addRequest = async (): Promise<void> => {
    if (newRequestType !== 2 && newRequestMessage === "") {
      alert("修正依頼または意見を送る場合はメッセージが必須です。");
      return;
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
        requestList = requestList;
        newRequestType = 0;
        newRequestMessage = "";
      }
    }
  };

  const modifyRequest = async (ev: CustomEvent<{ id: string }>) => {
    await modifyRequestInList(ev.detail.id, requestList);
    requestList = requestList;
  };
  const deleteRequest = async (ev: CustomEvent<{ id: string }>) => {
    requestList = await deleteRequestFromList(ev.detail.id, requestList);
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
    <ButtonUi on:click={() => openFileAsNewTab(documentId)}>新しいタブで開く</ButtonUi>
    <ButtonUi on:click={() => downloadDocument(documentId)}>ファイルをダウンロード</ButtonUi>
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
  <h3>リクエストを追加する</h3>
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
      <label for="request-message">メッセージ</label>
      <input
        id="request-message"
        type="text"
        name="message"
        placeholder={messagePlaceholder}
        bind:value={newRequestMessage}
      />
      <div class="add-button">
        <ButtonUi on:click={addRequest} disabled={addButtonDisabled}>追加</ButtonUi>
      </div>
    </fieldset>
  </div>
  {#if requestList.length > 0}
    <h3>これまでのリクエスト一覧</h3>
    <RequestContainer
      {requestList}
      showDocTitle={false}
      on:modify-request={modifyRequest}
      on:delete-request={deleteRequest}
    />
  {/if}
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

  .add-request-form {
    width: 97%;
    margin: 0 auto;
  }
  .add-request-form-field {
    display: grid;
    grid-template-rows: repeat(2, 1.8rem) 1fr;
    grid-template-columns: 8rem 1fr;
    row-gap: 1.5rem;
    column-gap: 0.7rem;
    width: 100%;
    margin: 2rem auto;
    padding: 1.6rem 2rem;
  }

  label {
    line-height: 1.8rem;
    margin-right: 0.7rem;
  }

  select,
  input {
    color: inherit;
    background-color: inherit;
    background-color: transparent;
    border: 1px solid #7f7f7f;
    transition: ease-in-out 0.2s;
  }
  input:focus {
    border-radius: 5px;
    background-color: var(--main-bg-color);
    backdrop-filter: blur(3rem);
  }
  select:focus {
    border-radius: 5px;
    background-color: var(--main-bg-color);
    backdrop-filter: blur(3rem);
  }

  .add-button {
    grid-column-start: 2;
    justify-self: right;
  }
  @media (max-width: 1024px) {
    .add-request-form-field {
      grid-template-rows: repeat(5, 1.8rem);
      grid-template-columns: 1fr;
      row-gap: 1.2rem;
    }
    .add-button {
      grid-column-start: 1;
    }
  }
</style>
