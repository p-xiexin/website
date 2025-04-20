<script lang="ts">
    import { base } from '$app/paths';
    import { theme } from '$lib/stores';
    
    let isDarkMode = false;

    $: isDarkMode = $theme === 'dark';    
    
  </script>
  
  <div class="w-full overflow-hidden">
    {#if !isDarkMode}
      <img 
        src="{base}/assets/github-contribution-snake/github-contribution-grid-snake.svg" 
        alt="github-contribution" />
    {:else}
      <img 
        src="{base}/assets/github-contribution-snake/github-contribution-grid-snake-dark.svg" 
        alt="github-contribution" />
    {/if}
  </div>