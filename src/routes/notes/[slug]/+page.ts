import { base } from '$app/paths';
import type { Note } from '$lib/utils/types';
import { error } from '@sveltejs/kit';
import { allNoteList } from '$lib/config/infoConfig.js';

export async function load({ params, fetch }): Promise<{ content: string; meta: Note | undefined }> {
  try {
    const postPath = `${base}/notes/${params.slug}/index.md`;

    const response = await fetch(postPath);

    if (!response.ok) {
      throw new Error(`Could not fetch ${params.slug}`);
    }

    const content = await response.text();

    const post = allNoteList.find((p) => p.slug === params.slug);

    return {
      content,
      meta: post
    };
  } catch (e) {
    console.error('加载文章时出错:', e);
    throw error(404, `找不到 ${params.slug} 文章`);
  }
}
