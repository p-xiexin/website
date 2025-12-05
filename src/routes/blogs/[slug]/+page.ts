import { base } from '$app/paths';
import type { Post } from '$lib/utils/types';
import { error } from '@sveltejs/kit';

type PostPageData = { content: string; meta: Post; columnPosts: Post[] };

export async function load({ params, fetch }): Promise<PostPageData> {
  try {
    const postsResponse = await fetch(`${base}/posts/postLists.json`);
    const posts: Post[] = await postsResponse.json();
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) {
      throw error(404, `Post ${params.slug} not found`);
    }

    const postPath = `${base}/posts/${post.title}.md`;
    const response = await fetch(postPath);
    if (!response.ok) {
      throw error(404, `Could not fetch ${params.slug}`);
    }
    const content = await response.text();

    const columnPosts =
      post.column?.name
        ? posts
            .filter((p) => p.column?.name === post.column?.name)
            .sort((a, b) => {
              const orderA = a.column?.order;
              const orderB = b.column?.order;

              if (orderA !== undefined && orderB !== undefined && orderA !== orderB) {
                return orderA - orderB;
              }
              if (orderA !== undefined && orderB === undefined) return -1;
              if (orderA === undefined && orderB !== undefined) return 1;
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
        : [];

    return {
      content,
      meta: post,
      columnPosts
    };
  } catch (e) {
    console.error('Error loading post', e);
    throw error(404, `Post ${params.slug} not found`);
  }
}
