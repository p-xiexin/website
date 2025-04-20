import { base } from '$app/paths'
import type { Post } from '$lib/utils/types'

export async function load({ fetch }: { fetch: typeof globalThis.fetch }) {
  // const response = await fetch(`${base}/api/posts`)
  // const posts: Post[] = await response.json()
  
  const postsResponse = await fetch(`${base}/posts/postLists.json`);
  const posts: Post[] = await postsResponse.json();

  return { posts };

}
