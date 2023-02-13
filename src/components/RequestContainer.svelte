<script lang="ts">
  import type { DocumentRequest } from "$lib/request";
  import RequestBudge from "./RequestBudge.svelte";

  export let requestList: DocumentRequest[];
  export let showDocTitle: boolean;
</script>

<div class="request-container">
  {#each requestList as request (request.id)}
    <RequestBudge {request} {showDocTitle} on:modify-request on:delete-request />
  {/each}
</div>

<style>
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
</style>
