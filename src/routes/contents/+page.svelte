<script lang="ts">
  import { getAllContents, type DocumentContent } from "$lib/doc";
  import ContentsListItem from "@/components/ContentsListItem.svelte";
  import { setAllFavDocIdListByUser } from "@/lib/favorite";
  import { onMount } from "svelte";

  let documentList: DocumentContent[];
  $: documentList = [];
  $: allDocumentNum = documentList.length;
  let favDocIdList: string[];
  $: favDocIdList = [];

  onMount(async () => {
    await getAllContents(documentList);
    documentList = documentList;
    await setAllFavDocIdListByUser(favDocIdList);
    favDocIdList = favDocIdList;
  });
</script>

<h1>コンテンツ一覧</h1>
<p>{allDocumentNum}件の文書があります。</p>
<div class="documents-list-container">
  {#each documentList as doc (doc.id)}
    <ContentsListItem item={doc} isFavorite={favDocIdList.includes(doc.urlStr)} />
  {/each}
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
