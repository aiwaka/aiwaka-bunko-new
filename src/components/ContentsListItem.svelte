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
    border: 3px ridge #777;
    border-radius: 9px;
    backdrop-filter: blur(1.5rem);
    margin: 0;
    height: 100%;
    padding: 1rem 1.8rem;
  }
  .item-title {
    font-size: 1.3rem;
  }
  .item-update {
    font-size: 0.9rem;
    color: #888;
    display: flex;
    column-gap: 1rem;
    flex-wrap: wrap;
  }
  .favorite-item {
    background-color: var(--favorite-link-color);
  }
  .favorite-item:hover {
    background-color: var(--favorite-hover-link-color);
  }
  .document-item:hover {
    backdrop-filter: blur(0);
    /* background-color: rgba(100, 100, 255, 0.2); */
  }
</style>
