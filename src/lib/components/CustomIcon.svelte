<script lang="ts">
    import {
        Bank,
        GithubLogo,
        XLogo,
        InstagramLogo,
        Envelope,
        GraduationCap,
        Coffee,
        Butterfly,
        Pill,
        WechatLogo,
        DiscordLogo,
        LinkedinLogo,
        Television,
        TiktokLogo,
    } from 'phosphor-svelte'
  
    export let name = '';
    export let size = 20;
  
    const icons = {
      bank: Bank,
      github: GithubLogo,
      x: XLogo,
      instagram: InstagramLogo,
      bsky: Butterfly,
      email: Envelope,
      college: GraduationCap,
      coffee: Coffee,
      pill: Pill,
      wechat: WechatLogo,
      discord: DiscordLogo,
      linkedin: LinkedinLogo,
      tiktok: TiktokLogo,
      bilibili: Television,
    };
  
    const IconComponent = icons[name as keyof typeof icons];
  </script>
  
  {#if IconComponent}
    <svelte:component this={IconComponent} size={size} weight="duotone" />
  {:else}
    <span class="text-red-500">Icon not found</span>
  {/if}