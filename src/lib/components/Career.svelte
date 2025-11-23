<script>
    import { Briefcase } from 'phosphor-svelte';
    import CustomIcon from '$lib/components/CustomIcon.svelte';
    import { getCareerByLocale } from '$lib/config/career';
    import { locale } from 'svelte-i18n';
    import { uiContent } from '$lib/i18n';
    import { t } from 'svelte-i18n';


    const FALLBACK_LOCALE = 'zh';
    $: currentLocale = $locale ?? FALLBACK_LOCALE;
    $: careerList = getCareerByLocale(currentLocale);
</script>

<div class="rounded-2xl border border-muted shadow-sm p-6">
    <h2 class="flex text-sm font-semibold">
    <Briefcase size={24} weight="duotone" />
    <span class="ml-3">{$uiContent.home.work}</span>
    </h2>
    <ol class="mt-6 space-y-4">
    {#each careerList as careerItem, index}
        <li class="flex gap-4">
        <div class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md border border-muted bg-background">
            <CustomIcon name={careerItem.logo} />
        </div>
        <dl class="flex flex-auto flex-wrap gap-x-2">
            <dt class="sr-only">Company</dt>
            <dd class="w-full flex-none text-sm font-medium">
            {careerItem.company}
            </dd>
            <dt class="sr-only">Title</dt>
            <dd class="text-xs text-muted-foreground">
            {careerItem.title}
            </dd>
            <dt class="sr-only">Date</dt>
            <dd
            class="ml-auto text-xs text-muted-foreground"
            aria-label={`${careerItem.start} until ${careerItem.end}`}
            >
            {careerItem.start} - {careerItem.end}
            </dd>
        </dl>
        </li>
    {/each}
    </ol>
</div>

