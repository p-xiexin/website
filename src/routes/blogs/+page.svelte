<script lang="ts">
  import { ChevronRight, Notebook, ChevronLeft, Search, X, Filter, ChevronDown, Lock } from 'lucide-svelte';
  import clsx from 'clsx';
  import { formatDate } from '$lib/utils/formatDate';
  import { getNotesByLocale } from '$lib/config/notes';
  import SimpleLayout from '$lib/components/SimpleLayout.svelte';
  import NoteCard from '$lib/components/NoteCard.svelte';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { Categories } from '$lib/utils/types';
  import { uiContent } from '$lib/i18n';
  import { t } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';
  import { authStore } from '$lib/stores/auth';

  let { data } = $props();

  const POSTS_PER_PAGE = 5;
  const FALLBACK_LOCALE = 'zh';
  const currentLocale = $derived($locale ?? FALLBACK_LOCALE);
  const notesLocalized = $derived(getNotesByLocale(currentLocale));

  let searchQuery = $state('');
  let isSearching = $state(false);
  let selectedCategory = $state('');
  let isDropdownOpen = $state(false);

  const currentPage = $derived(parseInt($page.url.searchParams.get('page') || '1', 10));
  const urlSearchQuery = $derived($page.url.searchParams.get('search') || '');
  const urlCategory = $derived($page.url.searchParams.get('category') || '');

  const visiblePosts = $derived(
    $authStore.isLoggedIn ? data.posts : data.posts.filter((post) => post.published)
  );
  const DESKTOP_MAX_VISIBLE_PAGES = 5;
  const MOBILE_MAX_VISIBLE_PAGES = 4;
  let maxVisiblePages = $state(DESKTOP_MAX_VISIBLE_PAGES);

  const allCategories = $derived((() => {
    const categories = new Set();
    visiblePosts.forEach((post) => {
      if (post.categories) {
        post.categories.forEach((category) => categories.add(category));
      }
    });
    return Array.from(categories).sort();
  })());

  $effect(() => {
    searchQuery = urlSearchQuery;
    selectedCategory = urlCategory;
    isSearching = urlSearchQuery.length > 0 || urlCategory.length > 0;
  });

  const filteredPosts = $derived((() => {
    let posts = visiblePosts;

    if (selectedCategory) {
      posts = posts.filter(
        (post) => post.categories && post.categories.includes(selectedCategory as Categories)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          (post.categories &&
            post.categories.some((category) => category.toLowerCase().includes(query)))
      );
    }

    return posts;
  })());

  const totalPosts = $derived(filteredPosts.length);
  const totalPages = $derived(Math.ceil(totalPosts / POSTS_PER_PAGE));
  const startIndex = $derived((currentPage - 1) * POSTS_PER_PAGE);
  const endIndex = $derived(startIndex + POSTS_PER_PAGE);
  const currentPosts = $derived(filteredPosts.slice(startIndex, endIndex));

  function updateUrl() {
    const url = new URL($page.url);

    if (searchQuery.trim()) {
      url.searchParams.set('search', searchQuery.trim());
    } else {
      url.searchParams.delete('search');
    }

    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    } else {
      url.searchParams.delete('category');
    }

    url.searchParams.delete('page');
    goto(url.toString());
  }

  function performSearch() {
    updateUrl();
  }

  function selectCategory(category: string) {
    selectedCategory = category;
    isDropdownOpen = false;
    updateUrl();
  }

  function clearAllFilters() {
    searchQuery = '';
    selectedCategory = '';
    isDropdownOpen = false;
    const url = new URL($page.url);
    url.searchParams.delete('search');
    url.searchParams.delete('category');
    url.searchParams.delete('page');
    goto(url.toString());
  }

  function clearSearch() {
    searchQuery = '';
    updateUrl();
  }

  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      performSearch();
    }
  }

  function goToPage(pageNumber: number) {
    const url = new URL($page.url);
    if (pageNumber === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', pageNumber.toString());
    }
    goto(url.toString());
  }

  const pageNumbers = $derived((() => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfRange = Math.floor((maxVisiblePages - 1) / 2);
      let startPage = Math.max(1, currentPage - halfRange);
      let endPage = Math.min(totalPages, currentPage + halfRange);

      if (endPage - startPage + 1 < maxVisiblePages - 1) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + (maxVisiblePages - 2));
        } else if (endPage === totalPages) {
          startPage = Math.max(1, endPage - (maxVisiblePages - 2));
        }
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  })());

  function handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.category-dropdown')) {
      isDropdownOpen = false;
    }
  }

  $effect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(max-width: 640px)');
      const updateVisiblePages = () => {
        maxVisiblePages = mediaQuery.matches ? MOBILE_MAX_VISIBLE_PAGES : DESKTOP_MAX_VISIBLE_PAGES;
      };
      updateVisiblePages();
      mediaQuery.addEventListener('change', updateVisiblePages);
      return () => mediaQuery.removeEventListener('change', updateVisiblePages);
    }
  });

  $effect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<SimpleLayout title={$uiContent.blogs.title} intro={$uiContent.blogs.intro}>
  <div class="mb-8">
    <div class="max-w-4xl mx-auto space-y-4">
      {#if !$authStore.isLoggedIn}
        <div class="flex items-center gap-3 rounded-xl border border-dashed border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
          <Lock class="h-4 w-4" />
          <span>{$t('ui.previewLoginHint')}</span>
        </div>
      {/if}
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder={$t('ui.searchPlaceholder')}
            class="block w-full pl-10 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground dark:bg-background dark:border-input dark:hover:bg-muted/70"
            bind:value={searchQuery}
            oninput={handleSearchInput}
            onkeydown={handleKeydown}
          />
          {#if searchQuery}
            <button
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              onclick={clearSearch}
              title={$t('ui.clearSearch')}
            >
              <X class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          {/if}
        </div>

        <div class="relative category-dropdown">
          <button
            class="flex items-center cursor-pointer justify-between w-full sm:w-48 px-4 py-2 border border-input rounded-md bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background dark:border-input dark:hover:bg-muted/70"
            onclick={() => (isDropdownOpen = !isDropdownOpen)}
          >
            <div class="flex items-center">
              <Filter class="h-4 w-4 mr-2" />
              <span class="truncate">
                {selectedCategory || $t('ui.allCategories')}
              </span>
            </div>
            <ChevronDown
              class={clsx('h-4 w-4 transition-transform', isDropdownOpen && 'rotate-180')}
            />
          </button>

          {#if isDropdownOpen}
            <div
              class="absolute right-0 mt-2 w-full sm:w-48 bg-background border border-input rounded-md shadow-lg z-50 max-h-64 overflow-y-auto dark:bg-background dark:border-input"
            >
              <button
                class={clsx(
                  'block w-full px-4 py-2 text-left hover:bg-muted transition-colors dark:hover:bg-muted/70',
                  !selectedCategory && 'bg-muted font-medium'
                )}
                onclick={() => selectCategory('')}
              >
                {$t('ui.allCategories')}
              </button>

              {#each allCategories as category}
                <button
                  class={clsx(
                    'block w-full px-4 py-2 text-left hover:bg-muted transition-colors dark:hover:bg-muted/70',
                    selectedCategory === category && 'bg-muted font-medium'
                  )}
                  onclick={() => selectCategory(String(category))}
                >
                  {category}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      {#if isSearching}
        <div class="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <div>
              {#if totalPosts === 0}
                No posts found
              {:else}
                Found {totalPosts} post{totalPosts === 1 ? '' : 's'}
              {/if}
              {#if searchQuery && selectedCategory}
                for "{searchQuery}" in "{selectedCategory}"
              {:else if searchQuery}
                for "{searchQuery}"
              {:else if selectedCategory}
                in "{selectedCategory}"
              {/if}
            </div>
          </div>
          <button class="text-primary hover:underline" onclick={clearAllFilters}>
            {$t('ui.clearAllFilters')}
          </button>
        </div>
      {/if}
    </div>
  </div>

  <div class="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
    {#if totalPosts === 0 && isSearching}
      <div class="text-center py-12">
        <div class="mx-auto max-w-md">
          <Search class="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 class="mt-2 text-sm font-semibold text-foreground">{$t('ui.noPostsFound')}</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {$t('ui.noPostsFoundDesc')}{' '}
            <button class="text-primary hover:underline" onclick={clearAllFilters}>
              {$t('ui.browseAllPosts')}
            </button>
          </p>
        </div>
      </div>
    {:else}
      <div class="flex max-w-3xl flex-col space-y-8 md:space-y-16">
        {#each currentPosts as blog (blog.slug)}
          <article class="md:grid md:grid-cols-4 md:items-baseline">
            <div class="group relative flex flex-col items-start md:col-span-3">
              <h2 class="text-base font-semibold tracking-tight">
                <div>
                  <div
                    class="absolute -inset-x-4 -inset-y-6 z-0 scale-95 transition group-hover:scale-100 sm:-inset-x-6 sm:rounded-2xl group-hover:bg-muted/50"
                  ></div>
                  <a href={`${base}/blogs/${blog.slug}`}>
                    <span class="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                    <span class="relative z-10">{blog.title}</span>
                  </a>
                </div>
              </h2>

              <div
                class="relative z-10 order-first mb-2 flex flex-col items-start gap-1 pl-3.5 md:hidden"
              >
                <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                  <span class="h-4 w-0.5 rounded-full bg-muted-foreground/30"></span>
                </span>
                <time datetime={blog.date} class="text-sm text-muted-foreground">
                  {formatDate(blog.date)}
                </time>
                {#if $authStore.isLoggedIn && !blog.published}
                  <span class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-100 dark:ring-amber-500/40">
                    {$t('ui.unpublished')}
                  </span>
                {/if}
              </div>

              <p class="relative z-10 mt-2 text-sm text-muted-foreground">
                {blog.description}
              </p>

              <div aria-hidden="true" class="relative z-10 mt-2 flex items-center text-sm font-medium text-primary">
                {$t('ui.readBlog')}
                <ChevronRight class="ml-1 h-4 w-4 stroke-current" />
              </div>
            </div>

            <div
              class="relative z-10 order-first mt-1 hidden text-sm text-muted-foreground md:flex md:flex-col md:items-start md:gap-2"
            >
              <time datetime={blog.date}>{formatDate(blog.date)}</time>
              {#if $authStore.isLoggedIn && !blog.published}
                <span class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-100 dark:ring-amber-500/40">
                  {$t('ui.unpublished')}
                </span>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    {/if}

    {#if totalPages > 1 && totalPosts > 0}
      <nav class="flex items-center justify-center space-x-2 mt-12 pt-8 border-t border-muted">
        <button
          class={clsx(
            'inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
            currentPage === 1 ? 'text-muted-foreground cursor-not-allowed' : 'text-foreground hover:bg-muted'
          )}
          disabled={currentPage === 1}
          onclick={() => goToPage(currentPage - 1)}
        >
          <ChevronLeft class="h-4 w-4 mr-0 sm:mr-1" />
          <span class="hidden sm:inline">{$t('ui.previous')}</span>
        </button>

        <div class="flex items-center space-x-1">
          {#each pageNumbers as pageNum}
            {#if pageNum === '...'}
              <span class="px-3 py-2 text-sm text-muted-foreground">...</span>
            {:else}
              <button
                class={clsx(
                  'inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors cursor-pointer',
                  pageNum === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
                onclick={() => goToPage(Number(pageNum))}
              >
                {pageNum}
              </button>
            {/if}
          {/each}
        </div>

        <button
          class={clsx(
            'inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
            currentPage === totalPages ? 'text-muted-foreground cursor-not-allowed' : 'text-foreground hover:bg-muted'
          )}
          disabled={currentPage === totalPages}
          onclick={() => goToPage(currentPage + 1)}
        >
          <span class="hidden sm:inline">{$t('ui.next')}</span>
          <ChevronRight class="h-4 w-4 ml-0 sm:ml-1" />
        </button>
      </nav>
    {/if}
  </div>

  <div class="mx-auto flex flex-col max-w-xl gap-6 lg:max-w-none my-4 py-8 border-t border-muted">
    <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-90 mb-4">
      <Notebook size={28} />
      {$uiContent.blogs.notesHeadline}
    </h2>
    <p class="text-base text-muted-foreground max-w-2xl mb-4">
      {$uiContent.blogs.notesIntro}
    </p>
    <ul
      role="list"
      class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]"
    >
      {#each notesLocalized as book (book.slug)}
        <NoteCard book={book} titleAs="h3" />
      {/each}
    </ul>
  </div>
</SimpleLayout>
