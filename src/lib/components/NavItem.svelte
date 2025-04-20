<script lang="ts">
    import { page } from '$app/stores';
    import clsx from 'clsx';

    let props = $props();
</script>
  
<li>
    <a
      href={props.href}
      class={clsx(
        'relative block px-3 py-2 transition',
        $page.url.pathname === props.href
          ? 'text-primary'
          : 'opacity-80 hover:opacity-100 hover:text-primary',
      )}
  >
    {props.item}
    {#if $page.url.pathname === props.href}
        <span class="absolute inset-x-1 -bottom-px h-[1.5px] bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 dark:from-primary/0 dark:via-primary/40 dark:to-primary/0"></span>
    {/if}
  </a>
</li>