<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { locale } from 'svelte-i18n';
  import { Languages, Globe2 } from 'lucide-svelte';

  let current = 'en';

  onMount(() => {
    const unsubscribe = locale.subscribe((value) => {
      if (!value) return;
      current = value;
      if (browser) {
        localStorage.setItem('locale', value);
      }
    });

    return () => {
      unsubscribe();
    };
  });

  const toggle = () => {
    const next = current === 'en' ? 'zh' : 'en';
    locale.set(next);
  };

</script>

<button
  type="button"
  class="group inline-flex h-7 w-7 cursor-pointer items-center justify-center text-muted-foreground hover:text-primary"
  aria-label="Toggle language"
  on:click={toggle}
>
  <span class="transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400">
    {#if current === 'en'}
      <Globe2 class="h-3.5 w-3.5" />
    {:else}
      <Languages class="h-3.5 w-3.5" />
    {/if}
  </span>
</button>
