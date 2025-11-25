<!-- src/lib/components/blog/BlogLayout.svelte -->
<script lang="ts">
  import { getContext } from 'svelte';
  import Container from '$lib/components/container/Container.svelte';
//   import Prose from '$lib/components/shared/Prose.svelte';
  import { formatDate } from '$lib/utils/formatDate';
  import type { Post } from '$lib/utils/types'
  import { t } from 'svelte-i18n';


  export let blog : Post;
  
  // Get previous pathname from context
  const previousPathname = getContext('previousPathname');
  
  // Handle back button click
  function goBack() {
    window.history.back();
  }
</script>

<Container class="mt-16 lg:mt-32">
  <div class="xl:relative">
    <div class="mx-auto max-w-4xl">
      {#if previousPathname}
        <button
          type="button"
          on:click={goBack}
          aria-label="Go back to blogs"
          style="cursor: pointer;"
          class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20"
        >
        <!-- ArrowLeftIcon -->
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400">
            <path
              d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      {/if}
      <article>
        <header class="flex flex-col">
          <!-- <h1 class="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100 break-words">
            {blog.title}
          </h1> -->
          <time
            datetime={blog.date}
            class="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
          >
            <span class="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
            <span class="ml-3">{formatDate(blog.date)}</span>
            <span class="mx-2">·</span>
            <span>{blog.author}</span>
          </time>
          {#if !blog.published}
            <span class="mt-2 inline-flex items-center gap-2 self-start rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-100 dark:ring-amber-500/40">
              {$t('ui.unpublished')}
            </span>
          {/if}
        </header>
        <div class="mt-8 prose dark:prose-invert max-w-none">
            <slot></slot>
        </div>
      </article>
    </div>
  </div>
</Container>
