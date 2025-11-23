<!-- src/routes/+page.svelte -->
<script>
  import Container from '$lib/components/container/Container.svelte';
  // import Newsletter from '$lib/components/Newsletter.svelte';
  import Career from '$lib/components/Career.svelte';
  import Education from '$lib/components/Education.svelte';
  import SocialLinks from '$lib/components/SocialLinks.svelte';
  import BlogCard from '$lib/components/BlogCard.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import ActivityCard from '$lib/components/ActivityCard.svelte';
  import {
    projects,
    techIcons
  } from '$lib/config/infoConfig';
  import { 
    awards, 
    activities, 
  } from '$lib/config/projects';
  import IconCloud from '$lib/externel/components/icon-cloud.svelte';
  import { Award, Briefcase, ChevronRightIcon, Heart, Notebook } from 'lucide-svelte';
  import NoteCard from '$lib/components/NoteCard.svelte';
  import GithubContrib from '$lib/components/GithubContrib.svelte';
  import { base } from '$app/paths';
  import { uiContent } from '$lib/i18n';
  import { t } from 'svelte-i18n';
  import { noteList } from '$lib/config/notes';

  
  export let data;

  const notesLocalized = noteList;
</script>

<Container class="mt-9">
  <!-- personal info -->
  <!-- 移动端布局：只在小屏显示 -->
  <div class="md:hidden mb-10 flex flex-col">
    <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl opacity-80">
      {$uiContent.home.headline}
    </h2>
    <div class="mt-4 flex justify-center">
      <div class="w-60 h-60 sm:w-72 sm:h-72">
        <IconCloud 
          iconSlugs={techIcons} 
          containerProps={{ class: "w-full h-full" }}
        />
      </div>
    </div>
    <p class="mt-6 text-xl text-muted-foreground">
      {$uiContent.home.introduction.join(' ')}
    </p>
    <SocialLinks className="mt-4" />
    <div class="mt-6 border-t border-zinc-100 py-8 dark:border-zinc-700/40">
      <GithubContrib />
    </div>
  </div>

  <!-- 桌面端布局：只在 md 及以上显示 -->
  <div class="hidden md:grid mb-10 grid-cols-2">
    <div class="md:mt-20">
      <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl opacity-80">
        {$uiContent.home.headline}
      </h2>
      <p class="mt-6 text-xl text-muted-foreground">
        {$uiContent.home.introduction.join(' ')}
      </p>
      <SocialLinks />
    </div>
    <div class="relative flex items-center justify-center overflow-hidden w-full px-20 md:px-0 md:w-2/3 ml-auto md:mr-8">
      <IconCloud iconSlugs={techIcons} />
    </div>
  </div>

  <div class="hidden md:block mt-6 border-t border-zinc-100 py-8 dark:border-zinc-700/40">
    <GithubContrib />
  </div>
  <!-- Awards -->
  <div class="mx-auto flex flex-col max-w-xl gap-6 lg:max-w-none my-4 py-8 border-t border-muted">
    <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-4">
      <Award size={28}/>
      {$uiContent.home.awardsHeadline}
    </h2>
    <ul
      role="list"
      class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]"
    >
      {#each awards as award (award.name)}
        <ActivityCard activity={award} titleAs="h3"/>
      {/each}
    </ul>
  </div>

  <!-- Research & Projects -->
  <div class="mx-auto flex flex-col max-w-xl gap-6 lg:max-w-none my-4 py-8 border-t border-muted">
    <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-4">
      <Briefcase size={28}/>
      {$uiContent.home.projectHeadline}
    </h2>
    <p class="text-base text-muted-foreground max-w-2xl mb-8">
      {$uiContent.home.projectIntro}
    </p>
    <ul
      role="list"
      class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]"
    >
      {#each projects as project (project.name)}
        <ProjectCard project={project} titleAs="h3"/>
      {/each}
    </ul>
  </div>

  <!-- Hobbies & Volunteer -->
  <div class="mx-auto flex flex-col max-w-xl gap-6 lg:max-w-none my-4 py-8 border-t border-muted">
    <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-4">
      <Heart size={28}/>
      {$uiContent.home.activitiesHeadline}
    </h2>
    <p class="text-base text-muted-foreground max-w-2xl mb-8">
      {$uiContent.home.activitiesIntro}
    </p>
    <ul
      role="list"
      class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]"
    >
      {#each activities as activity (activity.name)}
        <ActivityCard activity={activity} titleAs="h3"/>
      {/each}
    </ul>
  </div>
  <div class="mx-auto flex flex-col max-w-xl gap-6 lg:max-w-none my-4 py-8 border-t border-muted">
    <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-4">
        <Notebook size={28}/>
        {$uiContent.home.notesHeadline}
    </h2>
    <p class="text-base text-muted-foreground max-w-2xl mb-8">
      {$uiContent.home.notesIntro}
    </p>
    <ul
    role="list"
    class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]"
    >
        {#each notesLocalized as book (book.slug)}
            <NoteCard book={book} titleAs="h3"/>
        {/each}
    </ul>
  </div>

  <!-- Blog Section -->
  <div class="mx-auto flex flex-col max-w-xl gap-6 py-8 my-8 lg:max-w-none border-t border-muted">
    <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-4">
      {$uiContent.home.blogHeadline}
    </h2>
    <p class="text-base text-muted-foreground max-w-2xl mb-8">
      {$uiContent.home.blogIntro}
    </p>
  </div>
  <div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
    <!-- left column -->
    <!-- blog -->
    <div class="flex max-w-3xl flex-col space-y-8 md:space-y-16">
      <!-- {#each data.blogList as blog (blog.slug)}
        <BlogCard blog={blog} titleAs="h3"/>
      {/each} -->
      {#each data.posts.slice(0, 3) as blog (blog.slug)}
        <BlogCard {blog}/>
      {/each}
      <a href="{base}/blogs" class="flex flex-row items-center text-sm text-primary hover:underline capitalize font-semibold">{$t('ui.readMoreBlogs')} 
        <ChevronRightIcon class="ml-1 h-4 w-4 stroke-current" />
      </a>
    </div>

    <!-- right column -->
    <div class="space-y-10 lg:pl-16 xl:pl-24">
      <Career />
      <Education />
    </div>
  </div>
</Container>
