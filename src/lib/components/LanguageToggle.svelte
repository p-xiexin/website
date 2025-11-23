<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { locale } from 'svelte-i18n';
  import Button from './Button.svelte';

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

<Button
  variant="secondary"
  class="group cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
  aria-label="Toggle language"
  on:click={toggle}
>
  <span class="transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400">
    {current === 'en' ? '中文' : 'EN'}
  </span>
</Button>
