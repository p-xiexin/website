<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-svelte';
  import { locale } from 'svelte-i18n';
  import { authStore } from '$lib/stores/auth';
  import { getNotesByLocale } from '$lib/config/notes';
  import { uiContent } from '$lib/i18n';
  import SimpleLayout from '$lib/components/SimpleLayout.svelte';
  import type { Categories, Post } from '$lib/utils/types';

  let { data } = $props<{ data: { posts: Post[] } }>();

  const POSTS_PER_PAGE = 8;
  const currentLocale = $derived($locale ?? 'zh');
  const notesLocalized = $derived(getNotesByLocale(currentLocale));
  const currentPage = $derived(parseInt($page.url.searchParams.get('page') || '1', 10));
  const urlSearch = $derived($page.url.searchParams.get('search') || '');
  const urlCategory = $derived($page.url.searchParams.get('category') || '');

  let searchQuery = $state('');
  let selectedCategory = $state('');
  let isDropdownOpen = $state(false);

  const visiblePosts = $derived(
    $authStore.isLoggedIn ? data.posts : data.posts.filter((post: Post) => post.published)
  );
  const allCategories = $derived(
    Array.from(new Set<string>(visiblePosts.flatMap((post: Post) => post.categories ?? []))).sort()
  );
  const filteredPosts = $derived(visiblePosts.filter((post: Post) => {
    const query = searchQuery.trim().toLowerCase();
    const categoryMatch = !selectedCategory || post.categories?.includes(selectedCategory as Categories);
    const queryMatch = !query ||
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      post.categories?.some((category: Categories) => category.toLowerCase().includes(query));
    return categoryMatch && queryMatch;
  }));
  const totalPages = $derived(Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPosts = $derived(
    filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
  );

  $effect(() => {
    searchQuery = urlSearch;
    selectedCategory = urlCategory;
  });

  function updateUrl(resetPage = true) {
    const url = new URL($page.url);
    searchQuery.trim() ? url.searchParams.set('search', searchQuery.trim()) : url.searchParams.delete('search');
    selectedCategory ? url.searchParams.set('category', selectedCategory) : url.searchParams.delete('category');
    if (resetPage) url.searchParams.delete('page');
    goto(url.toString());
  }

  function selectCategory(category: string) {
    selectedCategory = category;
    isDropdownOpen = false;
    updateUrl();
  }

  function clearFilters() {
    searchQuery = '';
    selectedCategory = '';
    updateUrl();
  }

  function goToPage(pageNumber: number) {
    const url = new URL($page.url);
    pageNumber === 1 ? url.searchParams.delete('page') : url.searchParams.set('page', String(pageNumber));
    goto(url.toString());
  }
</script>

<svelte:head>
  <title>{$uiContent.blogs.title}</title>
  <meta name="description" content={$uiContent.blogs.intro} />
</svelte:head>

<SimpleLayout title={$uiContent.blogs.title} intro={$uiContent.blogs.intro} showDivider={false}>
  <section class="writing-section notes-section">
    <header class="section-label">
      <span class="section-code">01 / NOTES</span>
      <h2>{$uiContent.blogs.notesHeadline}</h2>
      <p>{$uiContent.blogs.notesIntro}</p>
      <small>{notesLocalized.length} collections</small>
    </header>
    <div class="section-main note-index">
      {#each notesLocalized as note, index}
        <a href={`${base}/notes/${note.slug}`}>
          <span class="entry-index">{String(index + 1).padStart(2, '0')}</span>
          <strong>{note.name}</strong>
          <span class="entry-description">{note.description}</span>
          <small>{note.tags.join(' · ')}</small>
        </a>
      {/each}
    </div>
  </section>

  <section class="writing-section archive-section">
    <header class="section-label">
      <span class="section-code">02 / ARTICLES</span>
      <h2>{$uiContent.blogs.articlesHeadline}</h2>
      <p>{$uiContent.blogs.articlesIntro}</p>
      <small>{filteredPosts.length} entries</small>
    </header>

    <div class="section-main archive-main">
      <div class="archive-tools">
        <div class="search-field">
          <span class="search-icon"><Search size={13} /></span>
          <input
            type="text"
            placeholder="搜索标题、摘要或分类"
            bind:value={searchQuery}
            onkeydown={(event) => event.key === 'Enter' && updateUrl()}
          />
          {#if searchQuery}<button aria-label="Clear search" onclick={() => { searchQuery = ''; updateUrl(); }}><X size={12} /></button>{/if}
        </div>
        <div class="category-dropdown">
          <button class="category-trigger" onclick={() => (isDropdownOpen = !isDropdownOpen)}>
            {selectedCategory || 'All categories'} <ChevronDown size={12} />
          </button>
          {#if isDropdownOpen}
            <div class="category-menu">
              <button class:active={!selectedCategory} onclick={() => selectCategory('')}>All categories</button>
              {#each allCategories as category}
                <button class:active={selectedCategory === category} onclick={() => selectCategory(category)}>{category}</button>
              {/each}
            </div>
          {/if}
        </div>
        {#if searchQuery || selectedCategory}
          <button class="clear-filter" onclick={clearFilters}>Clear filters</button>
        {/if}
      </div>

      <div class="archive-summary">
        <span>{filteredPosts.length} entries</span>
        {#if searchQuery || selectedCategory}<span>Filtered archive</span>{:else}<span>Complete archive</span>{/if}
      </div>

      {#if currentPosts.length === 0}
        <p class="empty-state">没有找到符合条件的文章。</p>
      {:else}
        <div class="post-list">
          {#each currentPosts as post}
            <article>
              <time datetime={post.date}>{post.date.slice(0, 10).replaceAll('-', '.')}</time>
              <div>
                <h2><a href={`${base}/blogs/${post.slug}`}>{post.title}</a></h2>
                <p>{post.description}</p>
                <small>{post.categories?.join(' · ') || 'Uncategorized'} · {post.author}</small>
              </div>
              {#if $authStore.isLoggedIn && !post.published}<span class="draft">Draft</span>{/if}
            </article>
          {/each}
        </div>
      {/if}

      {#if totalPages > 1}
        <nav class="pagination" aria-label="Pagination">
          <button disabled={currentPage === 1} onclick={() => goToPage(currentPage - 1)}><ChevronLeft size={13} /> Previous</button>
          <div>
            {#each Array(totalPages) as _, index}
              <button class:active={currentPage === index + 1} onclick={() => goToPage(index + 1)}>{index + 1}</button>
            {/each}
          </div>
          <button disabled={currentPage === totalPages} onclick={() => goToPage(currentPage + 1)}>Next <ChevronRight size={13} /></button>
        </nav>
      {/if}
    </div>
  </section>
</SimpleLayout>

<style>
  .writing-section { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 22px; }
  .writing-section + .writing-section { margin-top: 30px; }
  .section-label { align-self: start; position: sticky; top: 86px; }
  .section-code { display: block; margin-bottom: 9px; color: hsl(var(--muted-foreground)); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 9px; letter-spacing: .08em; }
  .section-label h2 { margin: 0; color: hsl(var(--primary)); font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 18px; font-weight: 650; line-height: 1.25; }
  .section-label p { margin: 6px 0 0; color: hsl(var(--muted-foreground)); font-size: 10px; line-height: 1.55; }
  .section-label small { display: block; margin-top: 10px; color: hsl(var(--muted-foreground)); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 8px; letter-spacing: .06em; text-transform: uppercase; }
  .section-main { min-width: 0; padding-left: 20px; border-left: 1px solid hsl(var(--border)); }
  .note-index a { display: grid; grid-template-columns: 28px minmax(94px, max-content) minmax(0, 1fr) auto; align-items: baseline; gap: 12px; padding: 10px 0; border-bottom: 1px solid hsl(var(--border)); color: inherit; text-decoration: none; }
  .note-index a:first-child { padding-top: 0; }
  .entry-index { color: hsl(var(--muted-foreground)); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 9px; }
  .note-index strong { color: hsl(var(--primary)); font-family: Georgia, serif; font-size: 12px; white-space: nowrap; }
  .entry-description { min-width: 0; color: hsl(var(--muted-foreground)); font-size: 10px; line-height: 1.45; }
  .note-index small { color: hsl(var(--muted-foreground)); font-size: 9px; white-space: nowrap; }
  .note-index a:hover strong { text-decoration: underline; text-underline-offset: 3px; }
  .archive-tools { display: flex; align-items: center; gap: 8px; padding-bottom: 10px; }
  .search-field { display: flex; height: 32px; flex: 1; align-items: center; gap: 7px; padding: 0 9px; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); }
  .search-icon { display: inline-flex; color: hsl(var(--muted-foreground)); }
  input { min-width: 0; flex: 1; border: 0; background: transparent; color: hsl(var(--foreground)); font-size: 11px; outline: none; }
  .search-field button, .clear-filter { color: hsl(var(--muted-foreground)); cursor: pointer; }
  .category-dropdown { position: relative; }
  .category-trigger { display: inline-flex; height: 32px; min-width: 138px; align-items: center; justify-content: space-between; gap: 8px; padding: 0 9px; border: 1px solid hsl(var(--border)); color: hsl(var(--muted-foreground)); font-size: 10px; cursor: pointer; }
  .category-menu { position: absolute; top: 36px; right: 0; z-index: 20; width: 180px; max-height: 260px; overflow-y: auto; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); box-shadow: 0 8px 24px rgb(0 0 0 / 10%); }
  .category-menu button { display: block; width: 100%; padding: 6px 8px; color: hsl(var(--muted-foreground)); font-size: 10px; text-align: left; cursor: pointer; }
  .category-menu button:hover, .category-menu button.active { background: hsl(var(--muted)); color: hsl(var(--primary)); }
  .clear-filter { font-size: 9px; text-decoration: underline; }
  .archive-summary { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid hsl(var(--border)); color: hsl(var(--muted-foreground)); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 8px; text-transform: uppercase; letter-spacing: .08em; }
  .post-list article { display: grid; grid-template-areas: "date body status"; grid-template-columns: 82px minmax(0, 1fr) auto; gap: 14px; padding: 12px 0; border-bottom: 1px solid hsl(var(--border)); }
  .post-list time { grid-area: date; color: hsl(var(--muted-foreground)); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 9px; white-space: nowrap; }
  .post-list article > div { grid-area: body; min-width: 0; }
  .post-list h2 { margin: 0; font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 14px; font-weight: 650; line-height: 1.4; }
  .post-list h2 a { color: hsl(var(--primary)); text-decoration: none; }
  .post-list h2 a:hover { text-decoration: underline; text-underline-offset: 3px; }
  .post-list p { margin: 3px 0 0; color: hsl(var(--muted-foreground)); font-size: 11px; line-height: 1.5; }
  .post-list small { display: block; margin-top: 4px; color: hsl(var(--muted-foreground)); font-size: 9px; }
  .draft { grid-area: status; color: #a16207; font-size: 9px; font-weight: 700; text-transform: uppercase; }
  .empty-state { padding: 30px 0; color: hsl(var(--muted-foreground)); font-size: 12px; text-align: center; }
  .pagination { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 14px 0; }
  .pagination > div { display: flex; gap: 2px; }
  .pagination button { display: inline-flex; height: 24px; min-width: 24px; align-items: center; justify-content: center; gap: 2px; color: hsl(var(--muted-foreground)); font-size: 9px; cursor: pointer; }
  .pagination button.active { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
  .pagination button:disabled { opacity: .4; cursor: default; }

  @media (max-width: 760px) {
    .writing-section { grid-template-columns: 1fr; gap: 12px; }
    .writing-section + .writing-section { margin-top: 26px; }
    .section-label { position: static; display: grid; grid-template-columns: auto 1fr; column-gap: 10px; align-items: baseline; }
    .section-code { grid-column: 1 / -1; margin-bottom: 2px; }
    .section-label p { margin: 0; }
    .section-label small { grid-column: 1 / -1; margin-top: 4px; }
    .section-main { padding-left: 0; border-left: 0; }
  }

  @media (max-width: 650px) {
    .archive-tools { flex-wrap: wrap; }
    .note-index a { grid-template-columns: 24px minmax(90px, max-content) minmax(0, 1fr); gap: 9px; }
    .note-index small { grid-column: 2 / -1; }
  }

  @media (max-width: 430px) {
    .section-label { display: block; }
    .section-label p { margin-top: 4px; }
    .note-index a { grid-template-columns: 24px minmax(0, 1fr); }
    .entry-description, .note-index small { grid-column: 2; }
    .post-list article { grid-template-areas: "date status" "body body"; grid-template-columns: 1fr auto; gap: 5px 10px; }
    .search-field { flex-basis: 100%; }
    .category-dropdown, .category-trigger { width: 100%; }
    .category-menu { right: 0; left: 0; width: 100%; }
  }
</style>
