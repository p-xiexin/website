<script lang="ts">
  import { base } from '$app/paths';
  import { ChevronDown, ChevronRight, Notebook } from 'lucide-svelte';
  import type { Post } from '$lib/utils/types';
  import { t } from 'svelte-i18n';

  type ColumnProps = {
    columnName: string;
    posts?: Post[];
    currentSlug: string;
  };

  let { columnName, posts = [], currentSlug }: ColumnProps = $props();
  let isOpen = $state(false);

  const sortedPosts = $derived(
    (posts ?? [])
      .slice()
      .sort((a: Post, b: Post) => {
        const orderA = a.column?.order;
        const orderB = b.column?.order;

        if (orderA !== undefined && orderB !== undefined && orderA !== orderB) {
          return orderA - orderB;
        }
        if (orderA !== undefined && orderB === undefined) return -1;
        if (orderA === undefined && orderB !== undefined) return 1;

        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
  );
  const formatDateNumeric = (dateString: string) =>
    new Date(`${dateString}T00:00:00Z`).toISOString().slice(0, 10);
</script>

{#if columnName}
  <section class="mt-8 rounded-xl border border-zinc-100 bg-white/60 p-4 shadow-sm shadow-zinc-200/50 backdrop-blur dark:border-zinc-700/40 dark:bg-zinc-800/60 dark:shadow-none">
    <button
      type="button"
      class="cursor-pointer group flex w-full items-center justify-between gap-3 text-left"
      onclick={() => (isOpen = !isOpen)}
    >
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/15">
          <Notebook class="h-4 w-4" />
        </div>
        <div class="flex items-center gap-2 text-mg font-semibold leading-tight text-foreground dark:text-white">
          <span>{$t('ui.columnLabel')}</span>
          <span class="text-muted-foreground">-</span>
          <span>{columnName}</span>
        </div>
      </div>
      <ChevronDown
        class={`group-hover:translate-x-0.5 group-hover:text-primary h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        aria-hidden="true"
      />
    </button>

    {#if isOpen && sortedPosts.length > 0}
      <ul class="mt-3 space-y-1.5 list-none p-0">
        {#each sortedPosts as post (post.slug)}
          {#if post}
            {#if post.slug === currentSlug}
              <li>
                <div
                  class="flex items-center justify-between gap-3 rounded-lg border border-dashed border-zinc-300/80 bg-zinc-50 px-3 py-2 text-foreground opacity-90 dark:border-zinc-700/80 dark:bg-zinc-700/50"
                  aria-disabled="true"
                >
                  <p class="flex-1 text-sm font-medium text-foreground dark:text-white">{post.title}</p>
                  <time
                    datetime={post.date}
                    class="text-xs font-normal text-muted-foreground tabular-nums text-right"
                  >
                    {formatDateNumeric(post.date)}
                  </time>
                </div>
              </li>
            {:else}
              <li>
                <a
                  class="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition hover:border-zinc-200 hover:bg-zinc-50 no-underline hover:no-underline dark:hover:border-zinc-700 dark:hover:bg-zinc-700/40"
                  href={`${base}/blogs/${post.slug}`}
                >
                  <div class="flex flex-1 items-center justify-between gap-3">
                    <p class="flex-1 text-sm font-medium text-foreground transition group-hover:text-primary dark:text-white">
                      {post.title}
                    </p>
                    <time
                      datetime={post.date}
                      class="text-xs font-normal text-muted-foreground tabular-nums text-right transition group-hover:text-primary"
                    >
                      {formatDateNumeric(post.date)}
                    </time>
                  </div>
                </a>
              </li>
            {/if}
          {/if}
        {/each}
      </ul>
    {/if}
  </section>
{/if}
