<script lang="ts">
  import { base } from '$app/paths';
  import type { Post } from '$lib/utils/types';
  import { t } from 'svelte-i18n';

  let { columnName, posts = [], currentSlug } = $props<{
    columnName: string;
    posts?: Post[];
    currentSlug: string;
  }>();
  let isOpen = $state(false);

  const sortedPosts = $derived(posts.slice().sort((a: Post, b: Post) => {
    const orderA = a.column?.order;
    const orderB = b.column?.order;
    if (orderA !== undefined && orderB !== undefined) return orderA - orderB;
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }));
</script>

{#if columnName}
  <section class="column-posts">
    <button type="button" onclick={() => (isOpen = !isOpen)}>
      <span>{$t('ui.columnLabel')} · {columnName}</span>
      <small>{sortedPosts.length} entries · {isOpen ? 'Hide' : 'Show'}</small>
    </button>
    {#if isOpen}
      <ol>
        {#each sortedPosts as post, index}
          <li class:current={post.slug === currentSlug}>
            <span>{index + 1}.</span>
            {#if post.slug === currentSlug}<strong>{post.title}</strong>{:else}<a href={`${base}/blogs/${post.slug}`}>{post.title}</a>{/if}
            <time>{post.date}</time>
          </li>
        {/each}
      </ol>
    {/if}
  </section>
{/if}

<style>
  .column-posts { margin: 12px 0; border-top: 1px solid hsl(var(--border)); border-bottom: 1px solid hsl(var(--border)); }
  button { display: flex; width: 100%; justify-content: space-between; padding: 7px 0; color: hsl(var(--primary)); font-size: 10px; font-weight: 650; cursor: pointer; }
  button small { color: hsl(var(--muted-foreground)); font-size: 9px; font-weight: 400; }
  ol { margin: 0; padding: 0 0 6px; list-style: none; }
  li { display: grid; grid-template-columns: 24px 1fr 76px; gap: 6px; padding: 4px 0; border-top: 1px solid hsl(var(--border)); font-size: 10px; }
  li > span, time { color: hsl(var(--muted-foreground)); }
  time { text-align: right; }
  a { color: hsl(var(--primary)); text-decoration: none; }
  a:hover { text-decoration: underline; }
  strong { font-weight: 650; }
</style>
