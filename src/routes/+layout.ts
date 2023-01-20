import type { LayoutLoad } from "@/../.svelte-kit/types/src/routes/$types.d";

export const prerender = true;
export const trailingSlash = "always";

export const load: LayoutLoad = ({ url, route }) => {
  const currentRoute = url.pathname;

  console.log(route);
  return {
    currentRoute,
  };
};
