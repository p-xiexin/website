<script lang="ts">
    import { Award, ChevronRight, Notebook, ChevronLeft, Search, X, Filter, ChevronDown } from 'lucide-svelte';
    import clsx from 'clsx';
    import { formatDate } from '$lib/utils/formatDate';
    import { blogHeadLine, blogIntro, noteList } from '$lib/config/infoConfig';
    import SimpleLayout from '$lib/components/SimpleLayout.svelte';
    import NoteCard from '$lib/components/NoteCard.svelte';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { Categories } from '$lib/utils/types';
    
    let { data } = $props();
    
    // 分页配置
    const POSTS_PER_PAGE = 5; // 每页显示的博客数量
    
    // 搜索状态
    let searchQuery = $state('');
    let isSearching = $state(false);
    let selectedCategory = $state('');
    let isDropdownOpen = $state(false);
    
    // 从 URL 参数获取当前页码、搜索关键词和分类
    const currentPage = $derived(parseInt($page.url.searchParams.get('page') || '1', 10));
    const urlSearchQuery = $derived($page.url.searchParams.get('search') || '');
    const urlCategory = $derived($page.url.searchParams.get('category') || '');
    
    // 获取所有分类
    const allCategories = $derived((() => {
        const categories = new Set();
        data.posts.forEach(post => {
            if (post.categories) {
                post.categories.forEach(category => categories.add(category));
            }
        });
        return Array.from(categories).sort();
    })());
    
    // 同步 URL 参数到本地状态
    $effect(() => {
        searchQuery = urlSearchQuery;
        selectedCategory = urlCategory;
        isSearching = urlSearchQuery.length > 0 || urlCategory.length > 0;
    });
    
    // 搜索和分类过滤逻辑
    const filteredPosts = $derived((() => {
        let posts = data.posts;
        
        // 按分类过滤
        if (selectedCategory) {
            posts = posts.filter(post => 
                post.categories && post.categories.includes(selectedCategory as Categories)
            );
        }
        
        // 按搜索关键词过滤
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            posts = posts.filter(post => 
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.author.toLowerCase().includes(query) ||
                (post.categories && post.categories.some(category => 
                    category.toLowerCase().includes(query)
                ))
            );
        }
        
        return posts;
    })());
    
    // 计算分页数据
    const totalPosts = $derived(filteredPosts.length);
    const totalPages = $derived(Math.ceil(totalPosts / POSTS_PER_PAGE));
    const startIndex = $derived((currentPage - 1) * POSTS_PER_PAGE);
    const endIndex = $derived(startIndex + POSTS_PER_PAGE);
    const currentPosts = $derived(filteredPosts.slice(startIndex, endIndex));
    
    // 更新 URL 参数
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
        
        // 过滤时重置到第一页
        url.searchParams.delete('page');
        goto(url.toString());
    }
    
    // 搜索函数
    function performSearch() {
        updateUrl();
    }
    
    // 分类选择函数
    function selectCategory(category: string) {
        selectedCategory = category;
        isDropdownOpen = false;
        updateUrl();
    }
    
    // 清除所有过滤
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
    
    // 清除搜索
    function clearSearch() {
        searchQuery = '';
        updateUrl();
    }
    
    // 处理搜索输入
    function handleSearchInput(event: Event) {
        const target = event.target as HTMLInputElement;
        searchQuery = target.value;
    }
    
    // 处理回车键搜索
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            performSearch();
        }
    }
    
    // 分页导航函数
    function goToPage(pageNumber: number) {
        const url = new URL($page.url);
        if (pageNumber === 1) {
            url.searchParams.delete('page');
        } else {
            url.searchParams.set('page', pageNumber.toString());
        }
        goto(url.toString());
    }
    
    // 生成分页数字数组
    const pageNumbers = $derived((() => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // 如果总页数小于等于最大显示页数，显示所有页码
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 复杂的分页逻辑
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);
            
            // 确保总是显示5个页码（如果可能）
            if (endPage - startPage + 1 < maxVisiblePages) {
                if (startPage === 1) {
                    endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                } else if (endPage === totalPages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
            }
            
            // 添加第一页和省略号
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }
            
            // 添加中间页码
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            // 添加省略号和最后一页
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }
        
        return pages;
    })());
    
    // 点击外部关闭下拉菜单
    function handleClickOutside(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.category-dropdown')) {
            isDropdownOpen = false;
        }
    }
    
    // 监听全局点击事件
    $effect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<SimpleLayout title={blogHeadLine} intro={blogIntro}>
    <!-- 搜索和分类过滤栏 -->
    <div class="mb-8">
        <div class="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <!-- 搜索框 -->
            <div class="relative flex-1">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search class="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    placeholder="Search posts..."
                    class="block w-full pl-10 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                    bind:value={searchQuery}
                    oninput={handleSearchInput}
                    onkeydown={handleKeydown}
                />
                {#if searchQuery}
                    <button
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onclick={clearSearch}
                        title="Clear search"
                    >
                        <X class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                {/if}
            </div>
            
            <!-- 分类选择下拉菜单 -->
            <div class="relative category-dropdown">
                <button
                    class="flex items-center justify-between w-full sm:w-48 px-4 py-2 border border-input rounded-md bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    onclick={() => isDropdownOpen = !isDropdownOpen}
                >
                    <div class="flex items-center">
                        <Filter class="h-4 w-4 mr-2" />
                        <span class="truncate">
                            {selectedCategory || 'All Categories'}
                        </span>
                    </div>
                    <ChevronDown class={clsx(
                        'h-4 w-4 transition-transform',
                        isDropdownOpen && 'rotate-180'
                    )} />
                </button>
                
                {#if isDropdownOpen}
                    <div class="absolute right-0 mt-2 w-full sm:w-48 bg-background border border-input rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                        <!-- 全部分类选项 -->
                        <button
                            class={clsx(
                                'block w-full px-4 py-2 text-left hover:bg-muted transition-colors',
                                !selectedCategory && 'bg-muted font-medium'
                            )}
                            onclick={() => selectCategory('')}
                        >
                            All Categories
                        </button>
                        
                        <!-- 分类列表 -->
                        {#each allCategories as category}
                            <button
                                class={clsx(
                                    'block w-full px-4 py-2 text-left hover:bg-muted transition-colors',
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
        
        <!-- 当前过滤状态和清除按钮 -->
        {#if isSearching}
            <div class="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <div class="flex items-center gap-4">
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
                
                <button
                    class="text-primary hover:underline"
                    onclick={clearAllFilters}
                >
                    Clear all filters
                </button>
            </div>
        {/if}
    </div>

    <div class="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
    <div class="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        {#if totalPosts === 0 && isSearching}
            <!-- 无搜索结果时的提示 -->
            <div class="text-center py-12">
                <div class="mx-auto max-w-md">
                    <Search class="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 class="mt-2 text-sm font-semibold text-foreground">No posts found</h3>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search terms or filters, or 
                        <button 
                            class="text-primary hover:underline"
                            onclick={clearAllFilters}
                        >
                            browse all posts
                        </button>
                    </p>
                </div>
            </div>
        {:else}
            <div class="flex max-w-3xl flex-col space-y-8 md:space-y-16">
                {#each currentPosts as blog (blog.slug)}
                <!-- Blog 组件 -->
                <article class="md:grid md:grid-cols-4 md:items-baseline">
                    <!-- Card 组件 -->
                    <div class="group relative flex flex-col items-start md:col-span-3">
                        <!-- Card.Title -->
                        <h2 class="text-base font-semibold tracking-tight">
                            <div>
                                <div class="absolute -inset-x-4 -inset-y-6 z-0 scale-95 transition group-hover:scale-100 sm:-inset-x-6 sm:rounded-2xl group-hover:bg-muted/50"></div>
                                <a href={`${base}/blogs/${blog.slug}`}>
                                    <span class="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                                    <span class="relative z-10">{blog.title}</span>
                                </a>
                            </div>
                        </h2>
                        
                        <!-- Card.Eyebrow (mobile only) -->
                        <time 
                            datetime={blog.date}
                            class="relative z-10 order-first mb-2 flex items-center text-sm text-muted-foreground pl-3.5 md:hidden"
                        >
                            <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                                <span class="h-4 w-0.5 rounded-full bg-muted-foreground/30"></span>
                            </span>
                            {formatDate(blog.date)}
                        </time>
                        
                        <!-- Card.Description -->
                        <p class="relative z-10 mt-2 text-sm text-muted-foreground">
                            {blog.description}
                        </p>
                        
                        <!-- Card.Cta -->
                        <div aria-hidden="true" class="relative z-10 mt-3 flex items-center text-sm font-medium text-primary">
                            Read blog
                            <ChevronRight class="ml-1 h-4 w-4 stroke-current" />
                        </div>
                    </div>
                    
                    <!-- Card.Eyebrow (desktop only) -->
                    <time 
                        datetime={blog.date}
                        class="relative z-10 order-first text-sm text-muted-foreground mt-1 hidden md:block"
                    >
                        {formatDate(blog.date)}
                    </time>
                </article>
                {/each}
            </div>
        {/if}
        
        <!-- 分页导航 -->
        {#if totalPages > 1 && totalPosts > 0}
        <nav class="flex items-center justify-center space-x-2 mt-12 pt-8 border-t border-muted">
            <!-- 上一页按钮 -->
            <button
                class={clsx(
                    'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    currentPage === 1
                        ? 'text-muted-foreground cursor-not-allowed'
                        : 'text-foreground hover:bg-muted'
                )}
                disabled={currentPage === 1}
                onclick={() => goToPage(currentPage - 1)}
            >
                <ChevronLeft class="h-4 w-4 mr-1" />
                Previous
            </button>
            
            <!-- 页码数字 -->
            <div class="flex items-center space-x-1">
                {#each pageNumbers as pageNum}
                    {#if pageNum === '...'}
                        <span class="px-3 py-2 text-sm text-muted-foreground">...</span>
                    {:else}
                        <button
                            class={clsx(
                                'inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors',
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
            
            <!-- 下一页按钮 -->
            <button
                class={clsx(
                    'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    currentPage === totalPages
                        ? 'text-muted-foreground cursor-not-allowed'
                        : 'text-foreground hover:bg-muted'
                )}
                disabled={currentPage === totalPages}
                onclick={() => goToPage(currentPage + 1)}
            >
                Next
                <ChevronRight class="h-4 w-4 ml-1" />
            </button>
        </nav>
        
        <!-- 分页信息 -->
        {#if totalPosts > 0}
            <div class="text-center mt-4 text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalPosts)} of {totalPosts} 
                {#if isSearching}
                    {#if searchQuery && selectedCategory}
                        posts matching "{searchQuery}" in "{selectedCategory}"
                    {:else if searchQuery}
                        posts matching "{searchQuery}"
                    {:else if selectedCategory}
                        posts in "{selectedCategory}"
                    {:else}
                        filtered posts
                    {/if}
                {:else}
                    posts
                {/if}
            </div>
        {/if}
        {/if}
    </div>
    
    <!-- NoteBooks 部分保持不变 -->
    <div class="mx-auto flex flex-col max-w-xl gap-6 lg:max-w-none my-4 py-8 border-t border-muted">
        <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-4">
            <Notebook size={28}/>
            {'NoteBooks'}
        </h2>
        <ul
            role="list"
            class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]"
        >
            {#each noteList as book (book.slug)}
                <NoteCard book={book} titleAs="h3"/>
            {/each}
        </ul>
    </div>
</SimpleLayout>