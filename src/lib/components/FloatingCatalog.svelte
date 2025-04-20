<script lang="ts">
  import { onMount } from 'svelte';

  export let catalog: {
    title: string;
    slug: string;
    children?: { title: string; slug: string }[];
  }[] = [];

  let activeSlug: string | null = null; // 存储当前活动slug

  // 滚动跳转函数
  function scrollToSlug(slug: string) {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  

</script>

<div 
  class="fixed z-30 w-64 text-sm hidden 2xl:block group"
  style="top: 50%; right: var(--side-space); transform: translate(100%, -50%);"
>
  <!-- <div class="catalog-container rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> -->
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
    margin-right: 0.5rem;
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
</style>
