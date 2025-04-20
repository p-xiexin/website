<script>
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores';
  import { Sun, Moon } from 'lucide-svelte';
  import Button from './Button.svelte';
  // import { Sun, Moon } from 'phosphor-svelte';

  // 初始化主题
  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      theme.set(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  });

  // 切换主题
  const toggleDarkMode = () => {
    theme.update(currentTheme => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  };
</script>

<!-- <Button 
  variant="secondary" 
  on:click={toggleDarkMode} 
  className="p-1 rounded-md cursor-pointer"
>
  {#if $theme === 'dark'}
    <Moon class="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  {:else}
    <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  {/if}
  <span class="sr-only">Toggle theme</span>
</Button> -->

<button on:click={toggleDarkMode} 
class="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
>
  {#if $theme === 'dark'}
    <Moon class="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  {:else}
    <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  {/if}
  <span class="sr-only">Toggle theme</span>
</button>
