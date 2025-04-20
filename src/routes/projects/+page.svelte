<script>
    import SimpleLayout from '$lib/components/SimpleLayout.svelte';
    import { projectHeadLine, projectIntro, projects } from '$lib/config/infoConfig';
    import { activities } from '$lib/config/projects.js';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import ActivityCard from '$lib/components/ActivityCard.svelte';
    import { Calendar } from 'lucide-svelte';
    
    // Svelte doesn't have built-in metadata handling like Next.js
    // You would typically handle metadata through your Svelte app's routing system
    // such as SvelteKit or through a custom head management solution
</script>
  
<svelte:head>
<title>Projects</title>
<meta name="description" content={projectHeadLine} />
</svelte:head>

<SimpleLayout title={projectHeadLine} intro={projectIntro}>
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
    Hobbies & Volunteer
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