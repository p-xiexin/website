<script lang='ts'>
    import { onMount } from 'svelte';
    import { derived, writable } from 'svelte/store';
    import { page } from '$app/stores';
    import GithubRepo from "./GithubRepo.svelte";
    import MobileNavBar from "./MobileNavBar.svelte";
    import NavBar from "./NavBar.svelte";
    import ThemeToggle from "./themeToggle.svelte";

// 判断是否是首页
  const isHomePage = derived(page, ($page) => $page.url.pathname === '/');

  let headerRef: HTMLDivElement;
  let isInitial = true;

  function clamp(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max);
  }

  function setProperty(property: string, value: string) {
    document.documentElement.style.setProperty(property, value);
  }

  function removeProperty(property: string) {
    document.documentElement.style.removeProperty(property);
  }

  function updateHeaderStyles() {
    if (!headerRef) return;

    const downDelay = 0;
    const upDelay = 64;

    const { top, height } = headerRef.getBoundingClientRect();
    const scrollY = clamp(
      window.scrollY,
      0,
      document.body.scrollHeight - window.innerHeight
    );

    if (isInitial) {
      setProperty('--header-position', 'sticky');
    }

    setProperty('--content-offset', `${downDelay}px`);

    if (isInitial || scrollY < downDelay) {
      setProperty('--header-height', `${downDelay + height}px`);
      setProperty('--header-mb', `${-downDelay}px`);
    } else if (top + height < -upDelay) {
      const offset = Math.max(height, scrollY - upDelay);
      setProperty('--header-height', `${offset}px`);
      setProperty('--header-mb', `${height - offset}px`);
    } else if (top === 0) {
      setProperty('--header-height', `${scrollY + height}px`);
      setProperty('--header-mb', `${-scrollY}px`);
    }
  }

  function updateStyles() {
    updateHeaderStyles();
    isInitial = false;
  }

  onMount(() => {
    updateStyles();
    window.addEventListener('scroll', updateStyles, { passive: true });
    window.addEventListener('resize', updateStyles);

    return () => {
      window.removeEventListener('scroll', updateStyles);
      window.removeEventListener('resize', updateStyles);
    };
  });
</script>

<header 
  class="pointer-events-none relative z-50 flex flex-none flex-col"
  style="height: var(--header-height); margin-bottom: var(--header-mb);"
>
    <div class="top-0 z-10 h-16 pt-6" bind:this={headerRef} style="position: var(--header-position);">
        <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
                <div class='relative flex gap-4'>
                    <div class="flex flex-1"></div>
                    <div class="flex flex-1 justify-end md:justify-center">
                        <NavBar />
                        <MobileNavBar/>
                    </div>
                    <div class="flex justify-end md:flex-1">
                        <div class="pointer-events-auto flex flex-row items-center gap-2 md:mr-2">
                            <ThemeToggle />
                            <GithubRepo />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

<style>
  :root {
    --header-height: 0px;
    --header-mb: 0px;
    --header-position: sticky;
  }
</style>
