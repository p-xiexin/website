<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { t } from 'svelte-i18n';
  
  export let catalog: {
    title: string;
    slug: string;
    children?: { title: string; slug: string }[];
  }[] = [];
  
  let showMobileCatalog = false;
  let panelRef: HTMLDivElement;
  
  function scrollToSlug(slug: string) {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      showMobileCatalog = false;
    } else {
      console.log(`element ${slug} not found`);
    }
  }
  
  function toggleMobileCatalog() {
    showMobileCatalog = !showMobileCatalog;
  }
  
  function closeMobileCatalog() {
    showMobileCatalog = false;
  }
  
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

<div
  class="fixed z-30 hidden w-80 text-sm 2xl:block group"
  style="top: 50%; right: var(--side-space); transform: translate(100%, -50%);"
>
  <div class="catalog-container rounded-xl">
    <div class="catalog-header">
      <div class="catalog-pill">
        <span>{$t('ui.contents')}</span>
      </div>
    </div>
    <div class="catalog-list">
      {#each catalog as item}
        <div class="catalog-block">
          <button
            type="button"
            class="catalog-item"
            on:click={() => scrollToSlug(item.slug)}
          >
            <div class="dot dot-main"></div>
            <span>{item.title}</span>
          </button>

          {#if item.children}
            <div class="sub-list">
              {#each item.children as subitem}
                <button
                  type="button"
                  class="sub-item"
                  on:click={() => scrollToSlug(subitem.slug)}
                >
                  <div class="dot dot-sub"></div>
                  <div>{subitem.title}</div>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<div class="relative pointer-events-auto 2xl:hidden">
  <button
    class="group flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-muted backdrop-blur fixed bottom-6 right-6 z-40 bg-card hover:bg-card/90 transition-colors"
    on:click={toggleMobileCatalog}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    {$t('ui.contents')}
  </button>

  {#if showMobileCatalog}
    <div 
      transition:fade 
      class="fixed inset-0 z-40 backdrop-blur-sm bg-background/80"
    ></div>

    <div
      bind:this={panelRef}
      transition:scale|local={{ duration: 150 }}
      class="fixed left-1/2 bottom-20 top-20 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 origin-center rounded-2xl ring-1 ring-muted bg-card shadow-xl overflow-hidden flex flex-col"
      use:clickOutside
    >
      <div class="flex flex-row-reverse items-center justify-between p-4 border-b border-muted shrink-0 bg-card/60 backdrop-blur">
        <button 
          aria-label="close menu" 
          class="-m-1 p-1 hover:bg-muted/50 rounded-lg transition-colors" 
          on:click={closeMobileCatalog}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-muted-foreground">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="flex items-center gap-2 text-sm font-semibold text-foreground">
          <div class="pill-soft">{$t('ui.contents')}</div>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-transparent via-card/40 to-card">
        <div class="space-y-0.5 mobile-catalog">
          {#each catalog as item}
            <div class="catalog-block">
              <button
                type="button"
                class="catalog-item"
                on:click={() => scrollToSlug(item.slug)}
              >
                <div class="dot dot-main"></div>
                <span>{item.title}</span>
              </button>
              
              {#if item.children}
                <div class="sub-list">
                  {#each item.children as subitem}
                    <button
                      type="button"
                      class="sub-item"
                      on:click={() => scrollToSlug(subitem.slug)}
                    >
                      <div class="dot dot-sub"></div>
                      <div>{subitem.title}</div>
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
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 14px 50px rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(14px);
    padding: 14px 16px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .catalog-container:hover {
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.12);
  }

  @media (prefers-color-scheme: dark) {
    .catalog-container {
      background: linear-gradient(180deg, rgba(24, 24, 27, 0.94), rgba(24, 24, 27, 0.88));
      border: 1px solid rgba(148, 163, 184, 0.22);
      box-shadow: 0 18px 60px rgba(0, 0, 0, 0.6);
    }
  }
  
  :global(.dark) .catalog-container {
    background: linear-gradient(180deg, rgba(24, 24, 27, 0.94), rgba(24, 24, 27, 0.88));
    border: 1px solid rgba(148, 163, 184, 0.22);
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.6);
  }

  .catalog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .catalog-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: #0f172a;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  @media (prefers-color-scheme: dark) {
    .catalog-pill {
      background: transparent;
      color: #f1f5f9;
    }
  }
  
  :global(.dark) .catalog-pill {
    background: transparent;
    color: #f1f5f9;
  }

  .catalog-list {
    display: flex;
    flex-direction: column;
    gap: 0.02rem;
  }
  
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    flex-shrink: 0;
  }

  .dot-main {
    background-color: #4f46e5;
  }
  
  .dot-sub {
    background-color: #a855f7;
  }
  
  @media (prefers-color-scheme: dark) {
    .dot-main {
      background-color: #60a5fa;
    }
    
    .dot-sub {
      background-color: #f472b6;
    }
  }
  
  :global(.dark) .dot-main {
    background-color: #60a5fa;
  }
  
  :global(.dark) .dot-sub {
    background-color: #f472b6;
  }

  .catalog-block {
    padding: 0.12rem 0.3rem;
    border-radius: 0.9rem;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .catalog-block:hover {
    background-color: rgba(59, 130, 246, 0.06);
    transform: translateX(-2px);
  }

  @media (prefers-color-scheme: dark) {
    .catalog-block:hover {
      background-color: rgba(59, 130, 246, 0.16);
    }
  }
  
  :global(.dark) .catalog-block:hover {
    background-color: rgba(59, 130, 246, 0.16);
  }

  .catalog-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    background: transparent;
    border: none;
    padding: 0.25rem 0.1rem;
    cursor: pointer;
    color: #0f172a;
    font-weight: 600;
    text-align: left;
    letter-spacing: 0.01em;
  }

  .catalog-item:hover {
    color: #2563eb;
  }

  @media (prefers-color-scheme: dark) {
    .catalog-item {
      color: #f1f5f9;
    }

    .catalog-item:hover {
      color: #bfdbfe;
    }
  }
  
  :global(.dark) .catalog-item {
    color: #f1f5f9;
  }

  :global(.dark) .catalog-item:hover {
    color: #bfdbfe;
  }

  .sub-list {
    margin-top: 0.1rem;
    margin-left: 0.8rem;
    padding-left: 0.6rem;
    border-left: 1px dashed rgba(15, 23, 42, 0.12);
    display: grid;
    gap: 0.12rem;
  }

  @media (prefers-color-scheme: dark) {
    .sub-list {
      border-left: 1px dashed rgba(148, 163, 184, 0.28);
    }
  }
  
  :global(.dark) .sub-list {
    border-left: 1px dashed rgba(148, 163, 184, 0.28);
  }

  .sub-item {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    background: transparent;
    border: none;
    padding: 0.2rem 0.05rem;
    cursor: pointer;
    color: #4b5563;
    text-align: left;
    transition: color 0.2s ease;
  }

  .sub-item:hover {
    color: #2563eb;
  }

  @media (prefers-color-scheme: dark) {
    .sub-item {
      color: #cbd5e1;
    }

    .sub-item:hover {
      color: #bfdbfe;
    }
  }
  
  :global(.dark) .sub-item {
    color: #cbd5e1;
  }

  :global(.dark) .sub-item:hover {
    color: #bfdbfe;
  }

  /* Tighter spacing on mobile drawer */
  .mobile-catalog {
    display: flex;
    flex-direction: column;
    gap: 0.01rem;
  }

  .mobile-catalog .catalog-block {
    padding: 0.1rem 0.28rem;
  }

  .mobile-catalog .catalog-item {
    padding: 0.14rem 0.06rem;
    gap: 0.45rem;
    font-size: 0.92rem;
  }

  .mobile-catalog .sub-list {
    margin-top: 0.08rem;
    margin-left: 0.75rem;
    padding-left: 0.55rem;
    gap: 0.1rem;
  }

  .mobile-catalog .sub-item {
    padding: 0.12rem 0.04rem;
    gap: 0.4rem;
    font-size: 0.9rem;
  }

  .pill-soft {
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
  }

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

  /* desktop catalog scrollbar */
  .catalog-container::-webkit-scrollbar {
    width: 5px;
  }

  .catalog-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .catalog-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.18);
    border-radius: 3px;
  }

  @media (prefers-color-scheme: dark) {
    .catalog-container::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.18);
    }
  }
</style>
