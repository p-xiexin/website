<script>
  import { locale } from 'svelte-i18n';
  import SimpleLayout from '$lib/components/SimpleLayout.svelte';
  import { getProjectsByLocale, getActivitiesByLocale } from '$lib/config/projects';
  import { uiContent } from '$lib/i18n';

  const FALLBACK_LOCALE = 'zh';
  $: currentLocale = $locale ?? FALLBACK_LOCALE;
  $: projectsLocalized = getProjectsByLocale(currentLocale);
  $: activitiesLocalized = getActivitiesByLocale(currentLocale);
</script>

<svelte:head>
  <title>{$uiContent.projects.title}</title>
  <meta name="description" content={$uiContent.projects.intro} />
</svelte:head>

<SimpleLayout title={$uiContent.projects.title} intro={$uiContent.projects.intro}>
  <section class="project-section">
    <h2>Research and engineering</h2>
    <div class="project-list">
      {#each projectsLocalized as project, index}
        <article>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <small>{project.tags.join(' · ')}</small>
          </div>
          <a href={project.link.href} target="_blank" rel="noreferrer">{project.link.label} ↗</a>
        </article>
      {/each}
    </div>
  </section>

  <section class="project-section activities">
    <h2>{$uiContent.projects.hobbiesTitle}</h2>
    <div class="project-list">
      {#each activitiesLocalized as activity, index}
        <article>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{activity.name}</h3>
            <p>{activity.description}</p>
            <small>{activity.date} · {activity.location}</small>
          </div>
          {#if activity.link}<a href={activity.link} target="_blank" rel="noreferrer">Project ↗</a>{/if}
        </article>
      {/each}
    </div>
  </section>
</SimpleLayout>

<style>
  .project-section + .project-section { margin-top: 24px; padding-top: 18px; border-top: 1px solid hsl(var(--border)); }
  .project-section > h2 { margin: 0 0 8px; color: hsl(var(--primary)); font-family: Georgia, serif; font-size: 10px; letter-spacing: .09em; text-transform: uppercase; }
  .project-list { border-top: 1px solid hsl(var(--border)); }
  article { display: grid; grid-template-columns: 34px 1fr auto; gap: 12px; padding: 11px 0; border-bottom: 1px solid hsl(var(--border)); }
  article > span { color: hsl(var(--muted-foreground)); font-family: Georgia, serif; font-size: 10px; }
  h3 { margin: 0; font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 13px; font-weight: 650; }
  p { margin: 3px 0 0; color: hsl(var(--muted-foreground)); font-size: 11px; line-height: 1.55; }
  small { display: block; margin-top: 4px; color: hsl(var(--muted-foreground)); font-size: 9px; }
  a { color: hsl(var(--primary)); font-size: 10px; font-weight: 600; text-decoration: none; }
  a:hover { text-decoration: underline; }
  @media (max-width: 520px) { article { grid-template-columns: 28px 1fr; } article > a { grid-column: 2; } }
</style>
