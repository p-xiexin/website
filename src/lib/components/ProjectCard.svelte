<script lang="ts">
  import { ArrowRightIcon, HashIcon } from 'lucide-svelte';
  import { ArrowUpRight } from 'phosphor-svelte'; // You'll need to adapt this import based on your setup
  import { utm_source } from '$lib/config/siteConfig'; // Adjust the import path as needed
	import type { ProjectItemType } from '$lib/config/infoConfig';

  // Define the type for the project prop
  export let project: ProjectItemType;
  export let titleAs = 'h2';

  // Compute the UTM link
  // $: utmLink = `https://${project.link.href}?utm_source=${utm_source}`;
  $: utmLink = project.link.href.startsWith('http')
              ? `${project.link.href}?utm_source=${utm_source}`
              : `https://${project.link.href}?utm_source=${utm_source}`;

  // Dynamic component
  $: Component = titleAs;
</script>

<li class="group relative flex flex-col items-start h-full">
  <div class="relative flex flex-col justify-between h-full w-full p-4 rounded-2xl border border-muted-foreground/20 shadow-sm transition-all group-hover:scale-[1.03] group-hover:shadow-md group-hover:bg-muted/5">
    <div>
      <div class="flex flex-col sm:flex-row justify-center sm:justify-start items-start sm:items-center gap-4">
				<!-- Replace Favicon with an appropriate Svelte component or import -->
        <!-- <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-full">
          <img src={`https://favicon.yandex.net/favicon/${project.link.href}`} alt="Favicon" />
        </div> -->
        <svelte:element this={Component} class="text-base font-semibold">
          {project.name}
        </svelte:element>
      </div>
      <p class="relative z-10 mt-2 text-sm text-muted-foreground ml-2">
        {project.description}
      </p>
    </div>

    <div class="relative z-10 mt-auto pt-4 ml-1">
      {#if project.tags && project.tags.length > 0}
        <div class="flex flex-wrap gap-x-2 items-center">
          {#each project.tags as tag, index}
            <div class="flex items-center justify-center space-x-0.5 group">
              <HashIcon class="w-3 h-3 text-muted-foreground icon-scale" />
              <span class="text-xs text-muted-foreground tracking-tighter">
                {tag}
              </span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
    
    <a 
      href={utmLink}
      target="_blank"
      rel="noopener noreferrer"
      class="absolute inset-0 z-20">
      <ArrowUpRight size={32} class="absolute top-4 right-4 h-4 w-4 group-hover:text-primary group-hover:cursor-pointer" />
    </a>
  </div>
</li>