<script lang="ts">
  import type { DocumentContent } from "$lib/doc";
  import ContentsListItem from "./ContentsListItem.svelte";

  export let documentList: DocumentContent[];
  export let favList: string[] | "all";
</script>

<div class="documents-list-container">
  {#if favList === "all"}
    {#each documentList as doc (doc.id)}
      <ContentsListItem item={doc} isFavorite={true} />
    {/each}
  {:else}
    {#each documentList as doc (doc.id)}
      <ContentsListItem item={doc} isFavorite={favList.includes(doc.urlStr)} />
    {/each}
  {/if}
</div>

<style>
  .documents-list-container {
    display: grid;
    grid-template-columns: repeat(3, 3fr);
    column-gap: 1rem;
    row-gap: 1rem;
    margin: 2rem 3%;
  }
  @media (max-width: 1024px) {
    .documents-list-container {
      grid-template-columns: repeat(2, 2fr);
    }
  }
</style>
