<script lang="ts">
  import { base } from '$app/paths';
  import { email, githubUsername, name } from '$lib/config/infoConfig';
</script>

<footer class="academic-footer">
  <div>
    <span>{name} · Huazhong University of Science and Technology</span>
    <nav aria-label="Footer navigation">
      <a href={`mailto:${email}`}>Email</a>
      <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer">GitHub</a>
      <a href={`${base}/blogs`}>Writing</a>
    </nav>
    <span>© {new Date().getFullYear()}</span>
  </div>
</footer>

<style>
  .academic-footer {
    border-top: 1px solid hsl(var(--border));
    background: color-mix(in srgb, hsl(var(--background)) 95%, hsl(var(--primary)));
  }
  .academic-footer > div {
    display: grid;
    width: min(980px, calc(100% - 32px));
    min-height: 46px;
    margin: 0 auto;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 24px;
    color: hsl(var(--muted-foreground));
    font-size: 9px;
  }
  nav { display: flex; gap: 14px; }
  a { color: hsl(var(--primary)); font-weight: 600; text-decoration: none; }
  a:hover { text-decoration: underline; }
  @media (max-width: 540px) {
    .academic-footer > div { width: calc(100% - 24px); grid-template-columns: 1fr auto; gap: 8px; padding: 8px 0; }
    nav { grid-column: 1 / -1; grid-row: 1; }
  }
</style>
