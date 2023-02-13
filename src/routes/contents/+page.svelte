<script lang="ts">
  import { getAllContents, type DocumentContent } from "$lib/doc";
  import ContentsListContainer from "@/components/ContentsListContainer.svelte";
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
<ContentsListContainer {documentList} favList={favDocIdList} />
