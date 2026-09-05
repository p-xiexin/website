<script lang="ts">
  import { formatDate } from '$lib/utils/formatDate';
  import type { Post } from '$lib/utils/types';
  import { t } from 'svelte-i18n';

  export let blog: Post;
</script>

<div class="article-shell">
  <button class="back-link" type="button" onclick={() => history.back()}>← Back</button>
  <article>
    <header>
      <time datetime={blog.date}>{formatDate(blog.date)}</time>
      <span>{blog.author}</span>
      {#if blog.categories?.length}<span>{blog.categories.join(' · ')}</span>{/if}
      {#if !blog.published}<strong>{$t('ui.unpublished')}</strong>{/if}
    </header>
    <div class="article-content"><slot></slot></div>
  </article>
</div>

<style>
  .article-shell { width: min(920px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 48px; }
  .back-link { display: inline-block; margin-bottom: 16px; color: #0969da; font-size: 12px; font-weight: 500; cursor: pointer; }
  .back-link:hover { text-decoration: underline; }
  article > header { display: flex; flex-wrap: wrap; gap: 7px 16px; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 6px 6px 0 0; color: #59636e; background: #f6f8fa; font-size: 12px; }
  header strong { color: #9a6700; font-size: 11px; text-transform: uppercase; }
  .article-content { padding: 28px 32px 36px; border: 1px solid #d0d7de; border-top: 0; border-radius: 0 0 6px 6px; background: hsl(var(--background)); }
  :global(.dark) article > header { border-color: #3d444d; color: #9198a1; background: #151b23; }
  :global(.dark) .article-content { border-color: #3d444d; }
  :global(.dark) .back-link { color: #4493f8; }
  :global(.dark) header strong { color: #d29922; }
  @media (min-width: 1180px) {
    .article-shell {
      width: min(900px, calc(100vw - 290px));
      margin-right: 0;
      margin-left: max(30px, calc((100vw - 1120px) / 2));
    }
  }
  @media (max-width: 640px) {
    .article-shell { width: calc(100% - 20px); padding-top: 16px; }
    article > header { padding: 9px 11px; }
    .article-content { padding: 20px 14px 28px; }
  }
</style>
