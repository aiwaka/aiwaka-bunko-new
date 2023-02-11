import type { PageLoad } from "./$types";

export const prerender = false;

export const load = (({ params }) => {
  return {
    documentId: params.id,
  };
}) satisfies PageLoad;
