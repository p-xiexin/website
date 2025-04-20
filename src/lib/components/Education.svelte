<script>
    import { Student } from 'phosphor-svelte';
    import { educationList } from '$lib/config/infoConfig';
    import CustomIcon from '$lib/components/CustomIcon.svelte';
  
    // The education item type can be imported or defined here
    // For example:
    /*
    export type EducationItemType = {
      school: string;
      major: string;
      start: string;
      end: string;
      logo: string;
    };
    */
</script>

<div class="rounded-2xl border border-muted shadow-sm p-6">
<h2 class="flex text-sm font-semibold">
    <Student size={24} weight="duotone" />
    <span class="ml-3">Education</span>
</h2>
<ol class="mt-6 space-y-4">
    {#each educationList as educationItem, index}
    <li class="flex gap-4">
        <div class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md border border-muted bg-background">
        <CustomIcon name={educationItem.logo} />
        </div>
        <dl class="flex flex-auto flex-wrap gap-x-2">
        <dt class="sr-only">Company</dt>
        <dd class="w-full flex-none text-sm font-medium">
            {educationItem.school}
        </dd>
        <dt class="sr-only">Title</dt>
        <dd class="text-xs text-muted-foreground">
            {educationItem.major}
        </dd>
        <dt class="sr-only">Date</dt>
        <dd
            class="ml-auto text-xs text-muted-foreground"
            aria-label={`${educationItem.start} until ${educationItem.end}`}
        >
            {educationItem.start} - {educationItem.end}
        </dd>
        </dl>
    </li>
    {/each}
</ol>
</div>