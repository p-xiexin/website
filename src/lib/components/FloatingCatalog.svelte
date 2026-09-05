<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { t } from 'svelte-i18n';

  export let catalog: {
    title: string;
    slug: string;
    children?: { title: string; slug: string }[];
  }[] = [];

  let showMobileCatalog = false;

  function scrollToSlug(slug: string) {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showMobileCatalog = false;
    }
  }

  function clickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) showMobileCatalog = false;
    };

    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
</script>

<aside class="desktop-catalog" aria-label={$t('ui.contents')}>
  <div class="catalog-container">
    <header class="catalog-header">
      <span>{$t('ui.contents')}</span>
      <small>{catalog.length}</small>
    </header>

    <nav class="catalog-list" aria-label={$t('ui.contents')}>
      {#each catalog as item}
        <div class="catalog-block">
          <button type="button" class="catalog-item" on:click={() => scrollToSlug(item.slug)}>
            {item.title}
          </button>

          {#if item.children?.length}
            <div class="sub-list">
              {#each item.children as subitem}
                <button type="button" class="sub-item" on:click={() => scrollToSlug(subitem.slug)}>
                  {subitem.title}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </nav>
  </div>
</aside>

<div class="mobile-catalog">
  <button
    type="button"
    class="catalog-trigger"
    aria-expanded={showMobileCatalog}
    on:click={() => (showMobileCatalog = !showMobileCatalog)}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" />
    </svg>
    <span>{$t('ui.contents')}</span>
  </button>

  {#if showMobileCatalog}
    <div transition:fade={{ duration: 120 }} class="catalog-backdrop"></div>
    <section
      transition:scale|local={{ duration: 140, start: 0.98 }}
      class="catalog-dialog"
      aria-label={$t('ui.contents')}
      use:clickOutside
    >
      <header class="dialog-header">
        <div>
          <strong>{$t('ui.contents')}</strong>
          <span>{catalog.length} sections</span>
        </div>
        <button type="button" aria-label="close menu" on:click={() => (showMobileCatalog = false)}>×</button>
      </header>

      <nav class="dialog-list" aria-label={$t('ui.contents')}>
        {#each catalog as item}
          <div class="catalog-block">
            <button type="button" class="catalog-item" on:click={() => scrollToSlug(item.slug)}>
              {item.title}
            </button>

            {#if item.children?.length}
              <div class="sub-list">
                {#each item.children as subitem}
                  <button type="button" class="sub-item" on:click={() => scrollToSlug(subitem.slug)}>
                    {subitem.title}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </nav>
    </section>
  {/if}
</div>

<style>
  .desktop-catalog {
    position: fixed;
    top: 96px;
    right: max(16px, calc((100vw - 1440px) / 2));
    z-index: 30;
    display: none;
    width: 220px;
  }

  .catalog-container {
    max-height: calc(100vh - 132px);
    overflow-y: auto;
    padding-left: 16px;
    border-left: 1px solid hsl(var(--border));
  }

  .catalog-header,
  .dialog-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 1px solid hsl(var(--border));
  }

  .catalog-header {
    margin-bottom: 7px;
    padding: 0 0 8px;
  }

  .catalog-header span,
  .dialog-header strong {
    color: hsl(var(--primary));
    font-family: Georgia, "Times New Roman", serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .catalog-header small,
  .dialog-header span {
    color: hsl(var(--muted-foreground));
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 9px;
    letter-spacing: .04em;
  }

  .catalog-list,
  .dialog-list {
    display: grid;
  }

  .catalog-block {
    border-bottom: 1px solid hsl(var(--border) / .58);
  }

  .catalog-item,
  .sub-item {
    display: block;
    width: 100%;
    border: 0;
    background: transparent;
    color: hsl(var(--muted-foreground));
    text-align: left;
    cursor: pointer;
    transition: color 120ms ease, border-color 120ms ease;
  }

  .catalog-item {
    padding: 7px 2px 6px;
    font-family: "Noto Serif SC", "Songti SC", Georgia, serif;
    font-size: 11px;
    font-weight: 650;
    line-height: 1.42;
  }

  .catalog-item:hover,
  .sub-item:hover {
    color: hsl(var(--primary));
  }

  .sub-list {
    display: grid;
    margin: 0 0 6px 4px;
    border-left: 1px solid hsl(var(--border));
  }

  .sub-item {
    padding: 3px 0 3px 10px;
    border-left: 2px solid transparent;
    font-size: 10px;
    line-height: 1.4;
  }

  .sub-item:hover {
    border-left-color: hsl(var(--primary));
  }

  .mobile-catalog {
    position: relative;
    z-index: 40;
  }

  .catalog-trigger {
    position: fixed;
    right: 16px;
    bottom: 18px;
    z-index: 42;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border: 1px solid hsl(var(--border));
    border-radius: 2px;
    background: hsl(var(--background));
    color: hsl(var(--primary));
    box-shadow: 0 2px 8px rgb(0 0 0 / 7%);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .04em;
    cursor: pointer;
  }

  .catalog-backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgb(15 23 42 / 24%);
  }

  .catalog-dialog {
    position: fixed;
    top: 78px;
    right: 14px;
    bottom: 58px;
    left: 14px;
    z-index: 41;
    display: flex;
    flex-direction: column;
    max-width: 620px;
    margin-left: auto;
    overflow: hidden;
    border: 1px solid hsl(var(--border));
    border-radius: 2px;
    background: hsl(var(--background));
    box-shadow: 0 12px 36px rgb(0 0 0 / 14%);
  }

  .dialog-header {
    flex: none;
    padding: 12px 14px 10px;
  }

  .dialog-header > div {
    display: grid;
    gap: 2px;
  }

  .dialog-header button {
    padding: 0 2px;
    color: hsl(var(--muted-foreground));
    font-family: Georgia, serif;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
  }

  .dialog-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 14px 16px;
  }

  .dialog-list .catalog-item {
    padding-top: 8px;
    font-size: 12px;
  }

  .catalog-container::-webkit-scrollbar,
  .dialog-list::-webkit-scrollbar {
    width: 4px;
  }

  .catalog-container::-webkit-scrollbar-thumb,
  .dialog-list::-webkit-scrollbar-thumb {
    background: hsl(var(--border));
  }

  @media (min-width: 1180px) {
    .desktop-catalog { display: block; }
    .mobile-catalog { display: none; }
  }
</style>
