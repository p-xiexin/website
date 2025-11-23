<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { XIcon, ChevronDownIcon } from 'lucide-svelte';
    import { t } from 'svelte-i18n';
    import { clickOutside } from '$lib/utils/onClickOutside';
  
    import { name } from '../config/infoConfig';
    import { navItems } from '../config/siteConfig';
    import LanguageToggle from './LanguageToggle.svelte';
  
    let open = false;
    let panelRef: HTMLDivElement;
  
    const toggle = () => open = !open;
    const close = () => open = false;
  </script>
  
  <div class="relative pointer-events-auto md:hidden">
  <!-- <div class="relative pointer-events-auto md:hidden"> -->
    <button
      class="group flex items-center rounded-full px-4 py-2 text-sm font-medium shadow-lg ring-1 ring-muted backdrop-blur"
      on:click={toggle}
    >
      {$t('ui.menu')}
      <ChevronDownIcon class="ml-3 h-auto w-2" />
    </button>
  
    {#if open}
      <div transition:fade class="fixed inset-0 z-40 backdrop-blur-sm dark:bg-background/80"></div>
  
      <div
        bind:this={panelRef}
        transition:scale|local={{ duration: 150 }}
        class="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl p-8 ring-1 ring-muted bg-card"
        use:clickOutside={() => (open = false)}
      >
        <div class="flex flex-row-reverse items-center justify-between">
          <button aria-label="Close menu" class="-m-1 p-1" on:click={close}>
            <XIcon class="h-6 w-6 text-muted-foreground" />
          </button>
          <h2 class="text-sm font-medium text-muted-foreground">{name}</h2>
        </div>
        <!-- <div class="mt-4 flex justify-end">
          <LanguageToggle />
        </div> -->
        <nav class="mt-6">
          <ul class="-my-2 divide-y divide-zinc-100 text-base dark:divide-zinc-100/5">
            {#each navItems as item}
              <li>
                <a href={item.href} class="block py-2" on:click={close}>
                    {$t(`nav.${item.key}`)}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
      </div>
    {/if}
  </div>
  
