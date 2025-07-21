<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  
  export let catalog: {
    title: string;
    slug: string;
    children?: { title: string; slug: string }[];
  }[] = [];
  
  let activeSlug: string | null = null; // 存储当前活动slug
  let showMobileCatalog = false; // 控制移动端目录显示
  let panelRef: HTMLDivElement;
  
  // 滚动跳转函数
  function scrollToSlug(slug: string) {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // 移动端滚动后关闭目录
      showMobileCatalog = false;
    } else {
      console.log(`元素 ${slug} 未找到`);
    }
  }
  
  // 切换移动端目录显示
  function toggleMobileCatalog() {
    showMobileCatalog = !showMobileCatalog;
  }
  
  // 关闭移动端目录
  function closeMobileCatalog() {
    showMobileCatalog = false;
  }
  
  // 点击外部关闭目录
  function clickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
        showMobileCatalog = false;
      }
    };
    
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
</script>

<!-- 桌面端目录 -->
<div
  class="fixed z-30 w-64 text-sm hidden 2xl:block group"
  style="top: 50%; right: var(--side-space); transform: translate(100%, -50%);"
>
  <div class="catalog-container rounded-lg">
    {#each catalog as item}
      <div class="mb-2">
        <div class="flex items-center mb-2 catalog-item">
          <div class="dot dot-main"></div>
          <button
            type="button"
            class="font-bold text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none p-0 text-left"
            on:click={() => scrollToSlug(item.slug)}
          >
            {item.title}
          </button>
        </div>
        
        {#if item.children}
          <div class="space-y-2 text-muted-foreground">
            {#each item.children as subitem}
              <button
                type="button"
                class="sub-item cursor-pointer rounded bg-transparent border-none p-0 text-left flex items-center hover:text-foreground"
                on:click={() => scrollToSlug(subitem.slug)}
              >
                <div class="dot dot-sub"></div>
                <div class="ml-2">{subitem.title}</div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<!-- 移动端目录组件 -->
<div class="relative pointer-events-auto 2xl:hidden">
  <!-- 浮动按钮 -->
  <button
    class="group flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-muted backdrop-blur fixed bottom-6 right-6 z-40 bg-card hover:bg-card/90 transition-colors"
    on:click={toggleMobileCatalog}
  >
    <!-- 目录图标 -->
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    目录
  </button>

  {#if showMobileCatalog}
    <!-- 背景遮罩 -->
    <div 
      transition:fade 
      class="fixed inset-0 z-40 backdrop-blur-sm bg-background/80"
    ></div>

    <!-- 目录面板 -->
    <div
      bind:this={panelRef}
      transition:scale|local={{ duration: 150 }}
      class="fixed inset-x-4 bottom-20 top-20 z-50 origin-center rounded-2xl ring-1 ring-muted bg-card shadow-xl overflow-hidden flex flex-col"
      use:clickOutside
    >
      <!-- 顶部栏 -->
      <div class="flex flex-row-reverse items-center justify-between p-4 border-b border-muted shrink-0">
        <button 
          aria-label="关闭目录" 
          class="-m-1 p-1 hover:bg-muted/50 rounded-lg transition-colors" 
          on:click={closeMobileCatalog}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-muted-foreground">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h2 class="text-sm font-medium text-muted-foreground">目录导航</h2>
      </div>
      
      <!-- 可滚动的目录内容 -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="space-y-3">
          {#each catalog as item}
            <div class="mb-3">
              <div class="flex items-center mb-2">
                <div class="dot dot-main"></div>
                <button
                  type="button"
                  class="font-bold text-foreground hover:text-primary cursor-pointer bg-transparent border-none p-0 text-left text-sm"
                  on:click={() => scrollToSlug(item.slug)}
                >
                  {item.title}
                </button>
              </div>
              
              {#if item.children}
                <div class="space-y-2 ml-4">
                  {#each item.children as subitem}
                    <button
                      type="button"
                      class="sub-item cursor-pointer bg-transparent border-none p-0 text-left flex items-center hover:text-primary text-muted-foreground text-sm"
                      on:click={() => scrollToSlug(subitem.slug)}
                    >
                      <div class="dot dot-sub"></div>
                      <div class="ml-2">{subitem.title}</div>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .catalog-container {
    background: transparent;
    box-shadow: none;
    border: none;
  }
  
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    flex-shrink: 0;
  }
  
  .dot-main {
    background-color: #a3a3a3;
  }
  
  .dot-sub {
    background-color: #d4d4d4;
  }
  
  @media (prefers-color-scheme: dark) {
    .dot-main {
      background-color: #4b5563;
    }
    
    .dot-sub {
      background-color: #374151;
    }
  }
  
  .catalog-item {
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .sub-item {
    display: flex;
    align-items: center;
  }

  /* 优化滚动条样式 */
  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
  
  @media (prefers-color-scheme: dark) {
    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
    }
  }
</style>