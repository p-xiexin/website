<!-- ContainerInner.svelte -->
<script>
  export let className = '';
</script>

<div class="relative px-4 sm:px-8 lg:px-12 {className}" {...$$restProps}>
  <div class="mx-auto max-w-2xl lg:max-w-5xl">
    <slot></slot>
  </div>
</div>