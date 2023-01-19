import { sveltekit } from "@sveltejs/kit/vite";
import { fileURLToPath } from "url";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
};

export default config;
