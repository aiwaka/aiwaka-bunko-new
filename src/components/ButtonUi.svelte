<script lang="ts">
  export let disabled = false;
</script>

<button class="button-ui" {disabled} on:click>
  <slot />
</button>

<style>
  button {
    margin: 0.3rem 0.5rem;
    border: 1px solid var(--main-font-color);
    border-radius: 12px;
    transition: 0.25s ease-out;
  }
  button[disabled] {
    color: #999999;
  }
  button:not([disabled]):hover {
    color: #333333;
    background-color: var(--main-font-color);
    border: 1px solid var(--page-link-hover-color);
  }
</style>
