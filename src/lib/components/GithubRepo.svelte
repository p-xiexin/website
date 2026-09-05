<script>
    import { githubUsername } from '$lib/config/infoConfig';
    import {GithubLogo} from 'phosphor-svelte'

</script>
  
<a
  href="https://github.com/{githubUsername}/website"
  target="_blank"
  rel="noopener noreferrer nofollow"
  class="group inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition hover:text-primary"
>
  <GithubLogo size="15" weight="duotone" />
  <span class="sr-only">Github Repo</span>
</a>
