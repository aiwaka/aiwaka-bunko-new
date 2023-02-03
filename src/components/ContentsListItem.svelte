<script lang="ts">
  import type { DocumentContent } from "$lib/doc";
  import NewItemIcon from "@/components/NewItemIcon.svelte";
  import { setPreviousDate } from "@/lib/utils";

  // NOTE: Svelteでは各コンポーネントで同じロジックを書くと最適化されるはず.
  const lastWeekDate = new Date();
  setPreviousDate(lastWeekDate);
  export let item: DocumentContent;
  export let isFavorite: boolean;
</script>

<a href={`/contents/${item.urlStr}`}>
  <div class="document-item" class:favorite-item={isFavorite}>
    <div class="item-title">{item.title}</div>
    <div class="item-update">
      <span class="update-date-string">
        last update : {item.postDateAsString()}
      </span>
      {#if item.update.toDate() > lastWeekDate}
        <NewItemIcon />
      {/if}
    </div>
  </div>
</a>

<style>
  .document-item {
    border: 2px solid #777777;
    border-radius: 7px;
    backdrop-filter: blur(1.5rem);
    margin: 1rem 1.6rem;
    padding: 1rem 1.8rem;
  }
  .item-title {
    font-size: 1.8rem;
  }
  .item-update {
    font-size: 1.1rem;
    color: #888;
    display: flex;
    column-gap: 1rem;
    flex-wrap: wrap;
  }
  .favorite-item {
    background-color: --favorite-link-color;
  }
  .favorite-item:hover {
    background-color: --favorite-hover-link-color;
  }
  .document-item:first-child {
    margin-top: 0;
  }
  .document-item:hover {
    backdrop-filter: blur(0);
    background-color: rgba(100, 100, 255, 0.2);
  }
</style>
