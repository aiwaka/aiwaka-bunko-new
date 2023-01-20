<script lang="ts">
  import { blur } from "svelte/transition";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import type { LayoutData } from "./$types";
  import SiteFooter from "@/components/SiteFooter.svelte";
  import SiteHeader from "@/components/SiteHeader.svelte";
  import { beforeNavigate } from "$app/navigation";
  import Analytics from "@/components/analytics/Analytics.svelte";

  /**
   * ヘッダのナビゲーションリストに渡すためのデータ.
   * nameとhrefを持つオブジェクトのリストを渡す.
   */
  const noLoginPageList = [
    { name: "TOP", href: "/" },
    { name: "LOGIN", href: "/login" },
    { name: "REGISTER", href: "/register" },
  ];
  const loginPageList = [
    { name: "TOP", href: "/" },
    { name: "CONTENTS", href: "/contents" },
    { name: "MYPAGE", href: "/my-page" },
  ];

  $: ogp = {
    url: $page.url.toString(),
  };

  export let data: LayoutData;

  beforeNavigate((navigation) => {
    console.log(navigation.to);
  });
</script>

<Analytics />

<svelte:head>
  <link rel="stylesheet" href={`${base}/style/main.css`} />
  <!-- ブログの個別ページでは別の画像や説明を設定するため除外する -->
  {#if $page.route.id !== `/blog/[slug]`}
    <meta property="og:url" content={ogp.url} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="あいわか文庫" />
    <meta property="og:description" content="あいわかが作った文書を保管するウェブサイト" />
    <meta property="og:site_name" content="あいわか文庫" />
    <meta property="og:image" content="TODO:" />
    <meta name="twitter:card" content="summary" />
  {/if}
</svelte:head>

<SiteHeader navLinkList={noLoginPageList} />
<div class="header-margin" />
<div class="body-container">
  {#key data.currentRoute}
    <main
      class="main-container"
      in:blur={{ duration: 250, delay: 50 }}
      out:blur={{ duration: 250 }}
    >
      <slot />
    </main>
  {/key}
</div>
<SiteFooter />

<style>
  .header-margin {
    height: 8rem;
  }
  .body-container {
    margin: 1rem 10%;
    display: grid;
    grid-template-columns: 70% 1fr;
    column-gap: 3rem;
  }
  .main-container {
    width: 90%;
    margin: auto;
  }
  @media (max-width: 1024px) {
    .body-container {
      margin: 1rem 4%;
      grid-template-columns: 1fr;
    }
    .main-container {
      width: 85%;
    }
  }
</style>
