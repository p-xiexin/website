<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { t } from 'svelte-i18n';
  import { Lock, Unlock } from 'lucide-svelte';
  import { navItems } from '$lib/config/siteConfig';
  import { authStore } from '$lib/stores/auth';
  import GithubRepo from './GithubRepo.svelte';
  import LanguageToggle from './LanguageToggle.svelte';
  import LoginModal from './LoginModal.svelte';
  import ThemeToggle from './themeToggle.svelte';

  let isLoginModalOpen = false;
  let activeSection = 'about';
  let scrollFrame = 0;

  const sectionKeys = ['about', 'education', 'publications', 'experience', 'projects'];

  const updateActiveSection = () => {
    if ($page.url.pathname !== `${base}/`) return;

    const header = document.querySelector('.academic-header');
    const threshold = (header?.getBoundingClientRect().bottom ?? 72) + 16;
    let currentSection = 'about';

    for (const key of sectionKeys) {
      const section = document.getElementById(key);
      if (section && section.getBoundingClientRect().top <= threshold) currentSection = key;
    }

    activeSection = currentSection;
  };

  const scheduleSectionUpdate = () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(updateActiveSection);
  };

  const openLogin = () => {
    if (!$authStore.isLoggedIn) isLoginModalOpen = true;
  };

  onMount(() => {
    window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
    window.addEventListener('resize', scheduleSectionUpdate);
    scheduleSectionUpdate();

    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', scheduleSectionUpdate);
      window.removeEventListener('resize', scheduleSectionUpdate);
    };
  });

  afterNavigate(() => scheduleSectionUpdate());
</script>

<header class="academic-header">
  <div class="header-row">
    <a class="header-name" href={`${base}/#about`}>
      <strong>Peng Xiexin</strong>
      <span>Academic profile</span>
    </a>

    <nav aria-label="Primary navigation">
      {#each navItems as item}
        <a
          class:active={item.key === 'blogs'
            ? $page.url.pathname.startsWith(`${base}/blogs`)
            : $page.url.pathname === `${base}/` && activeSection === item.key}
          aria-current={(item.key === 'blogs'
            ? $page.url.pathname.startsWith(`${base}/blogs`)
            : $page.url.pathname === `${base}/` && activeSection === item.key) ? 'location' : undefined}
          href={item.href}
        >
          {$t(`nav.${item.key}`)}
        </a>
      {/each}
    </nav>

    <div class="header-actions">
      <button
        type="button"
        class="login-button"
        class:logged-in={$authStore.isLoggedIn}
        onclick={openLogin}
        disabled={$authStore.isLoggedIn}
        aria-label={$t('ui.login')}
      >
        {#if $authStore.isLoggedIn}<Unlock size={14} />{:else}<Lock size={14} />{/if}
        <span>{$authStore.isLoggedIn ? $t('ui.previewing') : $t('ui.login')}</span>
      </button>
      <LanguageToggle />
      <ThemeToggle />
      <GithubRepo />
      <a class="school-mark" href="https://www.hust.edu.cn/" target="_blank" rel="noreferrer">HUST</a>
    </div>
  </div>
</header>

<LoginModal
  open={isLoginModalOpen}
  on:close={() => (isLoginModalOpen = false)}
  on:loggedin={() => (isLoginModalOpen = false)}
/>

<style>
  .academic-header {
    position: sticky;
    top: 0;
    z-index: 40;
    border-top: 3px solid hsl(var(--primary));
    border-bottom: 1px solid hsl(var(--border));
    background: color-mix(in srgb, hsl(var(--background)) 96%, transparent);
    backdrop-filter: blur(10px);
  }

  .header-row {
    display: grid;
    width: min(980px, calc(100% - 32px));
    min-height: 48px;
    margin: 0 auto;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 20px;
  }

  .header-name { text-decoration: none; }
  .header-name strong {
    display: block;
    color: hsl(var(--primary));
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15px;
    line-height: 1.05;
  }
  .header-name span {
    display: block;
    margin-top: 2px;
    color: hsl(var(--muted-foreground));
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  nav { display: flex; gap: 14px; }
  nav a {
    position: relative;
    padding: 17px 0 14px;
    color: hsl(var(--muted-foreground));
    font-size: 11px;
    font-weight: 600;
    text-decoration: none;
  }
  nav a:hover, nav a.active { color: hsl(var(--primary)); }
  nav a.active::after {
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: hsl(var(--primary));
    content: '';
  }

  .header-actions {
    display: flex;
    justify-self: end;
    align-items: center;
    gap: 3px;
  }
  .login-button {
    display: inline-flex;
    height: 28px;
    align-items: center;
    gap: 4px;
    padding: 0 6px;
    color: hsl(var(--muted-foreground));
    font-size: 9px;
    font-weight: 600;
    cursor: pointer;
  }
  .login-button:hover, .login-button.logged-in { color: hsl(var(--primary)); }
  .login-button:disabled { cursor: default; }
  .school-mark {
    margin-left: 5px;
    padding-left: 8px;
    border-left: 1px solid hsl(var(--border));
    color: hsl(var(--primary));
    font-family: Georgia, serif;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
  }

  @media (max-width: 760px) {
    .header-row { grid-template-columns: 1fr auto; padding: 8px 0 7px; }
    nav { grid-column: 1 / -1; grid-row: 2; gap: 16px; overflow-x: auto; }
    nav a { flex: 0 0 auto; padding: 2px 0; }
    .login-button span, .school-mark { display: none; }
  }

  @media (max-width: 420px) {
    .header-row { width: calc(100% - 24px); }
    nav { gap: 14px; }
  }
</style>
