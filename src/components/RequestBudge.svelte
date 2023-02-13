<script lang="ts">
  import type { DocumentRequest } from "$lib/request";
  import { createEventDispatcher } from "svelte";
  import ButtonUi from "./ButtonUi.svelte";
  const dispatch = createEventDispatcher();

  export let request: DocumentRequest;
  export let showDocTitle: boolean;

  // リクエストのステータスによって変化させる変数を処理
  $: statusMessage = "";
  $: budgeBoxShadowStyle = "";
  $: {
    let message = "";
    // `box-shadow`プロパティの値を動的に生成するが, 色のみ変化させるのでそれ以外はハードコーディングする.
    const shadowStyleTemplate = "inset 0px 0px 1rem 0.5rem";
    switch (request.status) {
      case 0:
        message = "以下の内容でリクエストを送りました。";
        budgeBoxShadowStyle = `${shadowStyleTemplate} rgba(35, 98, 245, 0.6)`;
        break;
      case 1:
        message = "リクエストが処理されました。";
        budgeBoxShadowStyle = `${shadowStyleTemplate} rgba(76, 248, 49, 0.6)`;
        break;
      case 2:
        message = "リクエストが拒否されました。";
        budgeBoxShadowStyle = `${shadowStyleTemplate} rgba(249, 34, 34, 0.6)`;
        break;
      default:
        message =
          "例外状態になっています。管理者に問い合わせてください。" + `コード：${request.status}`;
        budgeBoxShadowStyle = "0";
        break;
    }
    statusMessage = message;
  }

  const modifyRequest = () => {
    dispatch("modify-request", { id: request.id });
  };
  const deleteRequest = () => {
    dispatch("delete-request", { id: request.id });
  };
</script>

<div class="request-budge" style:box-shadow={budgeBoxShadowStyle}>
  {#if showDocTitle}
    <div class="doc-name">
      {request.targetName}
    </div>
    <div class="split-line" />
  {/if}
  <div class="request-message">
    <span>{statusMessage}</span>
  </div>
  <div class="split-line" />
  <div class="status-message">
    <span>{request.getTypeStr()}</span>
    {#if request.requestType !== 2}
      <span>：{request.message}</span>
    {/if}
  </div>

  <div class="button-container">
    {#if request.status === 0}
      <ButtonUi on:click={modifyRequest}>修正する</ButtonUi>
    {/if}
    {#if request.status !== 1}
      <ButtonUi on:click={deleteRequest}>取り消す</ButtonUi>
    {/if}
  </div>
</div>

<style>
  .split-line {
    height: 0;
    border-top: 1px solid #777;
  }
  .request-budge {
    margin: 0;
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;
    border: 3px ridge #777;
    border-radius: 10px;
    background-color: var(--main-bg-color);
    padding: 0.8rem 1.6rem;
  }
  .doc-name {
    font-weight: 800;
    font-size: larger;
  }

  .button-container {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;

    /* button {
        margin: 0.3rem 0.5rem;
        border: 1px solid rgb(100, 200, 255);
        border-radius: 12px;
        transition: 0.25s ease-out;

        &[disabled] {
          color: #999999;
        }
        &:not([disabled]):hover {
          color: #333333;
          background-color: rgb(100, 200, 255);
          border: 1px solid rgb(172, 255, 244);
        }
      } */
  }
</style>
