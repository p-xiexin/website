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
  .article-shell { width: min(860px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 42px; }
  .back-link { display: inline-block; margin-bottom: 14px; color: hsl(var(--primary)); font-size: 10px; font-weight: 600; cursor: pointer; }
  article > header { display: flex; flex-wrap: wrap; gap: 7px 14px; padding-bottom: 8px; border-bottom: 1px solid hsl(var(--border)); color: hsl(var(--muted-foreground)); font-size: 10px; }
  header strong { color: #b45309; font-size: 9px; text-transform: uppercase; }
  .article-content { margin-top: 12px; }
  @media (max-width: 480px) { .article-shell { width: calc(100% - 24px); } }
</style>
