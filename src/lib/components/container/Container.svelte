<!-- Container.svelte -->
<script>
  import ContainerOuter from './ContainerOuter.svelte';
  import ContainerInner from './ContainerInner.svelte';
  
  export let className = '';
</script>

<ContainerOuter {className} {...$$restProps}>
  <ContainerInner>
    <slot></slot>
  </ContainerInner>
</ContainerOuter>