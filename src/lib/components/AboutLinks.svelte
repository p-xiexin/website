<script>
    import CustomIcon from "./CustomIcon.svelte";
    import { email, socialLinks } from '../config/infoConfig'


</script>

<div>
    <div class="mt-6 flex items-center gap-1">
        {#each socialLinks as link, index}
            <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.ariaLabel ?? `Follow on ${link.name}`}
                class="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
                <CustomIcon name={link.icon} />
                <span class="sr-only">{link.name}</span>
            </a>
        {/each}
    </div>
    <div class="mt-8 border-t pt-8 ">
        <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noreferrer"
            aria-label='Email'
            class="group flex flex-row ml-3 justify-start items-center text-md font-medium transition dark:text-zinc-200 dark:hover:text-teal-500"
        >
            <CustomIcon name="email" size={22}/>
            <span class="ml-4">{email}</span>
        </a>
    </div>
</div>
