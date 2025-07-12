<script>
    import CustomIcon from "./CustomIcon.svelte";
    import { email, socialLinks } from '../config/infoConfig'
    import { utm_source } from "$lib/config/siteConfig";

    export let className = ""; // 用别名className避免和class关键字冲突
</script>

<div class={"mt-6 flex items-center " + className}>
    {#each socialLinks as link, index}
        <a
            href={`${link.href}?utm_source=${utm_source}`}
            target="_blank"
            rel="noreferrer"
            aria-label={link.ariaLabel ?? `Follow on ${link.name}`}
            class="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        >
            <CustomIcon name={link.icon} />
            <span class="sr-only">{link.name}</span>
        </a>
    {/each}
    <a
        href={`mailto:${email}`}
        target="_blank"
        rel="noreferrer"
        aria-label='Email'
        class="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
    >
        <CustomIcon name='email' />
        <span class="sr-only">Email</span>
    </a>
</div>
