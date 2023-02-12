<script lang="ts">
  export let active: boolean;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" id="star-symbol">
    <polygon
      points="0,-100 29.39,-40.45 95.11,-30.9 47.55,15.45 58.78,80.90 0,50 -58.78,80.9 -47.55,15.45 -95.11,-30.9 -29.39,-40.45"
    />
  </symbol>
</svg>
<button class="pin-button" on:click>
  <div class="designed-pin">
    <div class="pin" class:active-pin={active}>
      <svg class="star-icon" class:active-pin={active}>
        <use xlink:href="#star-symbol" href="#star-symbol" />
      </svg>
    </div>
  </div>
</button>

<style>
  .pin-button {
    margin: 0;
    padding: 0;
    border: none;
    background-color: transparent;
  }
  .designed-pin {
    position: relative;
    width: 40px;
  }

  .pin {
    background-color: var(--non-active-pin-color);
    width: 40px;
    height: 40px;
    text-align: center;
    vertical-align: middle;
    border-radius: 5px;
  }
  .pin.active-pin {
    background-color: var(--active-pin-color);
  }
  .pin.active-pin:after {
    border-top: 15px solid var(--active-pin-color);
  }
  .pin:after {
    content: "";
    position: absolute;
    border-top: 15px solid var(--non-active-pin-color);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 0px;
    top: 40px;
    left: calc(50% - 5px);
  }

  /* svgの再描画を避けるためApp.vueのテンプレートにsvgを記述してそれをuseするようにしている. */
  .star-icon {
    fill: darkgray;
    width: 20px;
    height: 20px;
    margin-top: 5px;
  }
  .star-icon.active-pin {
    fill: yellow;
  }
</style>
