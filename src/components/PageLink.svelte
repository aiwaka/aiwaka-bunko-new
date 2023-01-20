<script lang="ts">
  import { page } from "$app/stores";
  export let href: string;
  export let height = "5.5rem";
  export let mobileHeight = "1.6rem";
  export let color = "var(--main-font-color)";
  export let hoverColor = "var(--page-link-hover-color)";
  export let currentPageColor = "var(--current-page-link-color)";

  $: windowWidth = 0;
  $: resultHeight = windowWidth < 1024 ? mobileHeight : height;
  $: currentPage = $page.route.id === href;
</script>

<svelte:window bind:innerWidth={windowWidth} />
<div class="page-link__container">
  <a
    class:current-page={currentPage}
    class="page-link"
    style:line-height={resultHeight}
    style:color
    style:--hover-color={hoverColor}
    style:--current-page-color={currentPageColor}
    {href}
  >
    <slot />
  </a>
</div>

<style>
  .page-link {
    transition: 0.25s ease-in-out;
    display: block;
    position: relative;
    margin: 0 0.7rem;
    font-size: 1.6rem;
  }
  @media (max-width: 1024px) {
    .page-link {
      font-size: 1rem;
    }
  }

  .page-link:hover {
    color: var(--hover-color);
  }

  .page-link::before {
    content: "";
    width: 0;
    height: 0.15rem;
    background: var(--hover-color);
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    transition: 0.25s ease-out;
  }

  .page-link:hover::before {
    width: 100%;
  }

  .page-link.current-page {
    color: var(--hover-color);
  }
  .page-link.current-page::before {
    width: 100%;
    background-color: var(--current-page-color);
  }
</style>
