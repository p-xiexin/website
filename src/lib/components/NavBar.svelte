<script>
    import { t } from 'svelte-i18n';
    import { navItems } from '../config/siteConfig';
	import NavItem from './NavItem.svelte';

</script>

<nav class="pointer-events-auto hidden md:block">
    <ul class="flex rounded-full px-3 text-sm font-medium bg-card ring-1 ring-muted shadow-md backdrop-blur">
        {#each navItems as item, index}
            {#if index > 0}
                <li class="flex items-center">
                    <div class="h-4 w-px bg-muted-foreground/30"></div>
                </li>
            {/if}
            <NavItem href={item.href} item={$t(`nav.${item.key}`)}/>
        {/each}
    </ul>
</nav>

  
