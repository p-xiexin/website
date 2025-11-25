<script lang='ts'>
    import { onMount } from 'svelte';
    import { Lock, Unlock } from 'lucide-svelte';
    import { t } from 'svelte-i18n';
    import GithubRepo from "./GithubRepo.svelte";
    import MobileNavBar from "./MobileNavBar.svelte";
    import NavBar from "./NavBar.svelte";
    import ThemeToggle from "./themeToggle.svelte";
    import LanguageToggle from "./LanguageToggle.svelte";
    import LoginModal from './LoginModal.svelte';
    import { authStore } from '$lib/stores/auth';

  let headerRef: HTMLDivElement;
  let isInitial = true;
  let isLoginModalOpen = false;
  let toastVisible = false;
  let toastTimer: ReturnType<typeof setTimeout> | null = null;
  let toastTop = 76;

  function clamp(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max);
  }

  function setProperty(property: string, value: string) {
    document.documentElement.style.setProperty(property, value);
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

  const handleResize = () => {
    updateStyles();
    toastTop = (headerRef?.getBoundingClientRect().height ?? 64) + 12;
  };

  onMount(() => {
    updateStyles();
    toastTop = (headerRef?.getBoundingClientRect().height ?? 64) + 12;
    window.addEventListener('scroll', updateStyles, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', updateStyles);
      window.removeEventListener('resize', handleResize);
    };
  });

  const toggleLogin = () => {
    if ($authStore.isLoggedIn) {
      return;
    }
    isLoginModalOpen = true;
  };

  const handleLoggedIn = () => {
    isLoginModalOpen = false;
    toastVisible = true;
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      toastVisible = false;
    }, 3200);
  };
</script>

<header 
  class="pointer-events-none relative z-50 flex flex-none flex-col"
  style="height: var(--header-height); margin-bottom: var(--header-mb);"
>
    <div class="top-0 z-10 h-16 pt-6" bind:this={headerRef} style="position: var(--header-position);">
        <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
                <div class='relative flex gap-4'>
                    <div class="flex flex-1 items-center pointer-events-auto">
                      <button
                        class="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm ring-1 ring-muted transition hover:bg-muted sm:text-sm disabled:cursor-not-allowed disabled:opacity-80"
                        onclick={toggleLogin}
                        disabled={$authStore.isLoggedIn}
                        aria-pressed={$authStore.isLoggedIn}
                      >
                        {#if $authStore.isLoggedIn}
                          <Unlock class="h-4 w-4" />
                        {:else}
                          <Lock class="h-4 w-4" />
                          {$t('ui.login')}
                        {/if}
                      </button>
                    </div>
                    <div class="flex flex-1 justify-end md:justify-center">
                        <NavBar />
                        <MobileNavBar/>
                    </div>
                    <div class="flex justify-end md:flex-1">
                        <div class="pointer-events-auto flex flex-row items-center gap-2 md:mr-2">
                            <LanguageToggle />
                            <ThemeToggle />
                            <GithubRepo />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

<LoginModal
  open={isLoginModalOpen}
  on:close={() => (isLoginModalOpen = false)}
  on:loggedin={handleLoggedIn}
/>

{#if toastVisible}
  <div
    class="pointer-events-auto fixed z-50"
    style={`right: calc(var(--side-space, 16px) + 16px); top: ${toastTop}px;`}
  >
    <div class="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-lg ring-1 ring-muted">
      <Unlock class="h-4 w-4 text-primary" />
      <div class="flex flex-col">
        <span>{$t('ui.previewUnlocked')}</span>
        <span class="text-xs font-normal text-muted-foreground">{$t('ui.loginsuccess')}</span>
      </div>
    </div>
  </div>
{/if}

<style>
  :root {
    --header-height: 0px;
    --header-mb: 0px;
    --header-position: sticky;
  }
</style>
