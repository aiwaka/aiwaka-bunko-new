<script lang="ts">
  import type { DocumentRequest } from "$lib/request";
  import { createEventDispatcher } from "svelte";
  import ButtonUi from "./ButtonUi.svelte";
  const dispatch = createEventDispatcher();

  export let request: DocumentRequest;
  export let showDocTitle: boolean;
  // emits: ["delete-request", "modify-request"],

  $: statusMessage = "";
  $: {
    let message = "";
    switch (request.status) {
      case 0:
        message = "以下の内容でリクエストを送りました。";
        break;
      case 1:
        message = "リクエストが処理されました。";
        break;
      case 2:
        message = "リクエストが拒否されました。";
        break;
      default:
        message =
          "例外状態になっています。管理者に問い合わせてください。" + `コード：${request.status}`;
    }
    statusMessage = message;
  }
  $: budgeColorStyle = "";
  $: {
    switch (request.status) {
      case 1:
        budgeColorStyle = "rgba(76, 248, 49, 0.2)";
        break;
      case 2:
        budgeColorStyle = "rgba(249, 34, 34, 0.2)";
        break;
      default:
        budgeColorStyle = "rgba(35, 98, 245, 0.2)";
        break;
    }
  }

  const modifyRequest = () => {
    // context.emit("modify-request", props.request.id);
    dispatch("modify-request", { id: request.id });
  };
  const deleteRequest = () => {
    // context.emit("delete-request", props.request.id);
    dispatch("delete-request", { id: request.id });
  };

  // $: statusClass = "on-hold";
  // $: {
  //   switch (request.status) {
  //     case 1:
  //       statusClass = "accepted";
  //       break;
  //     case 2:
  //       statusClass = "rejected";
  //       break;
  //     default:
  //       statusClass = "on-hold";
  //   }
  // }
</script>

<div class="request-budge" style:background-color={budgeColorStyle}>
  {#if showDocTitle}
    <div class="doc-title">
      {request.targetName}
    </div>
  {/if}
  <div class="status-message">
    <span>{request.getTypeStr()}</span>
    {#if request.requestType !== 2}
      <span>：{statusMessage}</span>
    {/if}
  </div>
  <div class="request-message">
    {request.message}
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
  .request-budge {
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    padding: 0.8rem 1.6rem;
    margin: 0.7rem 1rem;
    width: 30rem;
  }
  .doc-title {
    font-weight: 800;
    font-size: larger;
  }
  .status-message {
    margin: 0.2rem auto;
  }

  .request-message {
    margin: 0.3 auto;
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
  /* .request-budge.on-hold {
    background-color: rgba(35, 98, 245, 0.2);
  }
  .request-budge.accepted {
    background-color: rgba(76, 248, 49, 0.2);
  }
  .request-budge.rejected {
    background-color: rgba(249, 34, 34, 0.2);
  } */
</style>
