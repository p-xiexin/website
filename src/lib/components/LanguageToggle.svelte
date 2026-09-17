<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { locale } from 'svelte-i18n';

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
  class="language-toggle"
  aria-label={current === 'en' ? 'Switch to Chinese' : '切换至英文'}
  title={current === 'en' ? '切换至中文' : 'Switch to English'}
  on:click={toggle}
>
  {current === 'en' ? '中' : 'EN'}
</button>

<style>
  .language-toggle {
    display: inline-flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    color: hsl(var(--muted-foreground));
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    font-size: 10px;
    font-weight: 650;
    letter-spacing: .02em;
    cursor: pointer;
  }

  .language-toggle:hover { color: hsl(var(--primary)); }
</style>
