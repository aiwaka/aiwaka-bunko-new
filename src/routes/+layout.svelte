<script lang="ts">
  import { blur } from "svelte/transition";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import type { LayoutData } from "./$types";
  import SiteFooter from "@/components/SiteFooter.svelte";
  import SiteHeader from "@/components/SiteHeader.svelte";
  import { beforeNavigate } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth } from "@/lib/firebase";

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

  $: pageList = noLoginPageList;
  if (browser) {
    // 認証状態の変化に応じてpageListの中身を変更するリスナーを設定する
    onAuthStateChanged(auth, (user) => {
      if (user === null) {
        pageList = noLoginPageList;
      } else {
        pageList = loginPageList;
      }
    });
  }

  beforeNavigate((navigation) => {
    console.log(navigation.to);
  });
</script>

<!-- <Analytics /> -->

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

<SiteHeader navLinkList={pageList} />
<div class="header-margin" />
<main class="main-container" in:blur={{ duration: 250, delay: 50 }} out:blur={{ duration: 250 }}>
  {#key data.currentRoute}
    <slot />
  {/key}
</main>
<SiteFooter />

<style>
  .header-margin {
    height: 8rem;
  }
  .main-container {
    margin: 0 20%;
  }
  @media (max-width: 1024px) {
    .main-container {
      margin: 0 5%;
    }
  }
</style>
