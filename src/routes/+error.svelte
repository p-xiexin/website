<script>
  import { base } from '$app/paths';
</script>

<div class="error-page">
  <span>404</span>
  <h1>Page not found</h1>
  <p>Sorry, we could not find the page you requested.</p>
  <a href={`${base}/`}>Return to homepage</a>
</div>

<style>
  .error-page { width: min(980px, calc(100% - 32px)); margin: 0 auto; padding: 64px 0; border-bottom: 1px solid hsl(var(--border)); }
  span { color: hsl(var(--muted-foreground)); font-family: Georgia, serif; font-size: 11px; }
  h1 { margin: 8px 0 0; color: hsl(var(--primary)); font-family: Georgia, serif; font-size: 28px; }
  p { margin: 8px 0 14px; color: hsl(var(--muted-foreground)); font-size: 12px; }
  a { color: hsl(var(--primary)); font-size: 11px; font-weight: 600; }
</style>
