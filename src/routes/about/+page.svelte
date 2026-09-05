<script>
  import travelImage from '$lib/images/travel.jpg';
  import AboutLinks from '$lib/components/AboutLinks.svelte';
  import SimpleLayout from '$lib/components/SimpleLayout.svelte';
  import { uiContent } from '$lib/i18n';
</script>

<svelte:head>
  <title>{$uiContent.about.pageTitle}</title>
  <meta name="description" content={$uiContent.about.paragraphs.join(' ')} />
</svelte:head>

<SimpleLayout title={$uiContent.about.pageTitle} intro={$uiContent.about.headline}>
  <div class="about-layout">
    <div class="about-copy">
      {#each $uiContent.about.paragraphs as paragraph}
        <p>{paragraph}</p>
      {/each}
    </div>
    <aside>
      <img src={travelImage} alt="" />
      <AboutLinks />
    </aside>
  </div>
</SimpleLayout>

<style>
  .about-layout { display: grid; grid-template-columns: minmax(0, 1fr) 240px; gap: 42px; }
  .about-copy { columns: 2; column-gap: 28px; }
  .about-copy p { break-inside: avoid; margin: 0; color: hsl(var(--muted-foreground)); font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 13px; line-height: 1.75; }
  .about-copy p + p { margin-top: 8px; }
  aside { border-left: 1px solid hsl(var(--border)); padding-left: 20px; }
  img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; filter: saturate(.72); }
  aside :global(.mt-6) { margin-top: 10px; }
  aside :global(.mt-8) { margin-top: 12px; padding-top: 12px; }
  @media (max-width: 700px) {
    .about-layout { grid-template-columns: 1fr; gap: 24px; }
    .about-copy { columns: 1; }
    aside { border-top: 1px solid hsl(var(--border)); border-left: 0; padding: 18px 0 0; }
    img { max-width: 300px; }
  }
</style>
