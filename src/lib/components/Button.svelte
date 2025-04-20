<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    // Define variant styles
    const variantStyles = {
      primary:
        'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70',
      secondary:
        'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70',
    };
    
    // Define props
    export let variant: keyof typeof variantStyles = 'primary';
    export let href: string | undefined = undefined;
    export let className = '';
    
    // Combine classes
    $: combinedClass = `inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none ${variantStyles[variant]} ${className}`;
    
    // Event dispatcher for handling button events
    const dispatch = createEventDispatcher();
    
    // Forward all events with proper type
    function forwardEvent(event: Event): void {
      dispatch(event.type, event);
    }
  </script>
  
  {#if href === undefined}
    <button 
      class={combinedClass}
      on:click={forwardEvent}
      on:mouseenter={forwardEvent}
      on:mouseleave={forwardEvent}
      on:focus={forwardEvent}
      on:blur={forwardEvent}
      {...$$restProps}
    >
      <slot></slot>
    </button>
  {:else}
    <a 
      {href}
      class={combinedClass}
      on:click={forwardEvent}
      on:mouseenter={forwardEvent}
      on:mouseleave={forwardEvent}
      on:focus={forwardEvent}
      on:blur={forwardEvent}
      {...$$restProps}
    >
      <slot></slot>
    </a>
  {/if}