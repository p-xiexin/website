<script lang="ts">
  import { base } from '$app/paths';
  import MarkdownRender from '$lib/components/MarkdownRender.svelte';

  let { data } = $props();

  function preprocessImageLinks(content: string, bookName: string): string {
    const basePath = `${base}/notes/${bookName}/res`;
    content = content.replace(/!\[([^\]]*)\]\((\.?\/?res\/[^)]+)\)/g, (_match, alt, path) => {
      const filename = path.replace(/^\.?\/?res\//, '');
      return `![${alt}](${basePath}/${filename})`;
    });
    return content.replace(/<img\s+([^>]*?)src=["']\.?\/?res\/([^"']+)["']([^>]*?)>/g, (_match, beforeSrc, filename, afterSrc) =>
      `<img ${beforeSrc}src="${basePath}/${filename}"${afterSrc}>`
    );
  }

  const content = $derived(data?.content && data?.meta?.slug
    ? preprocessImageLinks(data.content, data.meta.slug)
    : '');
</script>

<svelte:head><title>{data.meta?.name ? `${data.meta.name} · Notes` : 'Notes'}</title></svelte:head>

{#if data.meta}
  <div class="note-shell"><MarkdownRender {content} /></div>
{:else}
  <p class="load-error">文章加载失败</p>
{/if}

<style>
  .note-shell { width: min(860px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 42px; }
  .load-error { width: min(860px, calc(100% - 32px)); margin: 32px auto; }
  @media (max-width: 480px) { .note-shell, .load-error { width: calc(100% - 24px); } }
</style>
