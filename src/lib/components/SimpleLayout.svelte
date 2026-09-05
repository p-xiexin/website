<script>
  export let title = '';
  export let intro = '';
</script>

<div class="academic-page-shell">
  <header class="page-heading">
    <h1>{title}</h1>
    {#if intro}<p>{intro}</p>{/if}
  </header>
  <div class="page-body"><slot></slot></div>
</div>

<style>
  .academic-page-shell { width: min(980px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 36px; }
  .page-heading { display: grid; grid-template-columns: max-content minmax(0, 1fr); align-items: baseline; gap: 36px; padding-bottom: 14px; border-bottom: 2px solid hsl(var(--primary)); }
  h1 { color: hsl(var(--primary)); font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 26px; font-weight: 650; line-height: 1.2; white-space: nowrap; }
  p { margin: 0; color: hsl(var(--muted-foreground)); font-size: 12px; line-height: 1.55; }
  .page-body { margin-top: 18px; }
  @media (max-width: 720px) {
    .academic-page-shell { width: calc(100% - 24px); padding-top: 22px; }
    .page-heading { grid-template-columns: 1fr; gap: 6px; }
    h1 { font-size: 23px; white-space: normal; }
  }
</style>
