<script>
    import { githubUsername } from '$lib/config/infoConfig';
    import {GithubLogo} from 'phosphor-svelte'

</script>
  
<a
  href="https://github.com/{githubUsername}/website"
  target="_blank"
  rel="noopener noreferrer nofollow"
  class="text-md group flex flex-row items-center justify-start font-medium transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
>
  <GithubLogo size="18" weight="duotone" />
  <span class="sr-only">Github Repo</span>
</a>