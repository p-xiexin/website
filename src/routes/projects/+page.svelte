<script>
    import SimpleLayout from '$lib/components/SimpleLayout.svelte';
    import { projects } from '$lib/config/infoConfig';
    import { activities } from '$lib/config/projects';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import ActivityCard from '$lib/components/ActivityCard.svelte';
    import { Calendar } from 'lucide-svelte';
    import { uiContent } from '$lib/i18n';
</script>
  
<svelte:head>
<title>{$uiContent.projects.title}</title>
<meta name="description" content={$uiContent.projects.intro} />
</svelte:head>

<SimpleLayout title={$uiContent.projects.title} intro={$uiContent.projects.intro}>
<ul
    role="list"
    class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 pb-10 auto-rows-[1fr]"
>
    {#each projects as project (project.name)}
    <ProjectCard project={project} />
    {/each}
</ul>

<div class="mx-auto flex flex-col max-w-xl gap-6 lg:max-w-none my-4 py-8 border-t border-muted">
    <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-4">
    <Calendar size={28}/>
    {$uiContent.projects.hobbiesTitle}
    </h2>
    <ul
    role="list"
    class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]"
    >
    {#each activities as activity (activity.name)}
        <ActivityCard activity={activity} titleAs="h3"/>
    {/each}
    </ul>
</div>
</SimpleLayout>
