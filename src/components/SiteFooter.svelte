<script lang="ts">
</script>

<footer class="site-footer">
  <div class="footer-contents">
    <p id="footer-copyright">&copy;Aiwaka 2023, All right reserved.</p>
  </div>
</footer>

<style>
  .site-footer {
    position: sticky;
    display: flex;
    flex-direction: column;
    top: 100vh;
    width: 100vw;
    text-align: center;
    margin: 0;
    height: fit-content;
    background: var(--main-bg-color);
  }
  .footer-contents {
    width: 60%;
    margin: auto;
  }
  @media (max-width: 1024px) {
    .footer-contents {
      width: 85%;
    }
  }
  .site-footer p {
    display: inline-block;
    font-size: 1rem;
    line-height: 8rem;
    color: var(--main-font-color);
  }
</style>
