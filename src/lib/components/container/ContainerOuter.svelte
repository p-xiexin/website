<script>
  export let className = '';
</script>

<div class="sm:px-4 {className}" {...$$restProps}>
  <div class="mx-auto w-full max-w-7xl lg:px-4">
    <slot></slot>
  </div>
</div>