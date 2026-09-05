<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import { onMount } from 'svelte';
  import { setupI18n } from '$lib/i18n';
  import '../app.css';

  let { children } = $props();

  onMount(() => {
    setupI18n();
  });
</script>

<svelte:body />

<div class="academic-app">
  <Header />
  <main class="site-content">{@render children()}</main>
  <Footer />
</div>

<style>
  .academic-app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .site-content {
    flex: 1;
    min-width: 0;
  }
</style>
