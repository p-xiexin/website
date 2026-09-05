<script>
  import { email, socialLinks } from '$lib/config/infoConfig';
</script>

<div class="about-links">
  <a href={`mailto:${email}`}>{email}</a>
  {#each socialLinks as link}
    <a href={link.href} target="_blank" rel="noreferrer">{link.name} ↗</a>
  {/each}
</div>

<style>
  .about-links { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; padding-top: 10px; border-top: 1px solid hsl(var(--border)); }
  a { color: hsl(var(--primary)); font-size: 10px; font-weight: 600; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
