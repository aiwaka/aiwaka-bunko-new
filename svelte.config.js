import staticAdapter from "@sveltejs/adapter-static";
// import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter: adapter(),
    adapter: staticAdapter({
      fallback: null,
      // pages: "dist",
      precompress: true,
    }),
  },
};

export default config;
