import { base } from '$app/paths';
import type { Post } from '$lib/utils/types';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }): Promise<{ content: string; meta: Post | undefined }> {
  try {
    const postsResponse = await fetch(`${base}/posts/postLists.json`);
    const posts: Post[] = await postsResponse.json();
    const post = posts.find((p) => p.slug === params.slug);

    const postPath = `${base}/posts/${post?.title}.md`;
    const response = await fetch(postPath);
    if (!response.ok) {
      throw new Error(`Could not fetch ${params.slug}`);
    }
    const content = await response.text();

    return {
      content,
      meta: post
    };
  } catch (e) {
    console.error('加载文章时出错:', e);
    throw error(404, `找不到 ${params.slug} 文章`);
  }
}
