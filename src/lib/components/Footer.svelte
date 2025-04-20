<script>
    import { navItems } from "$lib/config/siteConfig";
    import ThemeToggle from "./themeToggle.svelte";
    import SocialLinks from "./SocialLinks.svelte";
    import ContainerInner from "./container/ContainerInner.svelte";
    import ContainerOuter from "./container/ContainerOuter.svelte";
    import { name } from '../config/infoConfig';

</script>

<footer class="mt-32 flex-none">
    <ContainerOuter>
        <div class="border-t border-muted pb-16 pt-10">
            <ContainerInner>
                <div class="mx-auto max-w2xl lg:max-w-5xl">
                    <div class="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
                    <div class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium">
                        {#each navItems as item}
                            <a href={item.href}>{item.name}</a>
                        {/each}
                    </div>
                    <div class='flex flex-col justify-center items-start'>
                        <div class='flex flex-row justify-end items-center gap-2'>
                        <p class="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} {name}. All rights reserved.
                        </p>
                        <ThemeToggle />
                        </div>
                        <SocialLinks/>
                    </div>
                    </div>
                </div>
            </ContainerInner>
        </div>
    </ContainerOuter>
</footer>