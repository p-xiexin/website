import { base } from '$app/paths'
import type { Post } from '$lib/utils/types'

export async function load({ fetch }: { fetch: typeof globalThis.fetch }) {
  // const response = await fetch(`${base}/api/posts`)
  // const posts: Post[] = await response.json()
  
  // 直接从静态文件加载 posts 和 notes
  const postsResponse = await fetch(`${base}/posts/postLists.json`);
  const posts: Post[] = await postsResponse.json();

  return { posts };

}
