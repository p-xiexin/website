<script>
  import Container from "./container/Container.svelte";

  export let title = '';
  export let intro = '';
</script>

<Container class="mt-16 sm:mt-32">
  <header class="max-w-2xl">
    <h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
      {title}
    </h1>
    <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">
      {intro}
    </p>
  </header>
    <div class="mt-16 sm:mt-20">
      <slot></slot>
    </div>
</Container>