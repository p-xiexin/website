<script>
    import { base } from '$app/paths';
    import Button from '$lib/components/Button.svelte';
    import Container from '$lib/components/container/Container.svelte'
  </script>
  
  <Container class="flex h-full items-center pt-16 sm:pt-32">
    <div class="flex flex-col items-center">
      <p class="text-base font-semibold text-zinc-400 dark:text-zinc-500">
        404
      </p>
      <h1 class="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
        Page not found
      </h1>
      <p class="mt-4 text-base text-zinc-600 dark:text-zinc-400">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Button href="{base}/" variant="secondary" class="mt-4">
        Go back home
      </Button>
    </div>
  </Container>
  