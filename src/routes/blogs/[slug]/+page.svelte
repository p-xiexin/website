<script lang="ts">
    import BlogLayout from '$lib/components/BlogLayout.svelte';
    import MarkdownRender from "$lib/components/MarkdownRender.svelte";
	import { base } from "$app/paths";
    import { setContext } from 'svelte';
    import { Lock } from 'lucide-svelte';
    import { t } from 'svelte-i18n';
    import { authStore } from '$lib/stores/auth';

    let { data } = $props();

	// 设置 context：从哪来的，比如列表页的 URL
	setContext('previousPathname', '/blogs');


	function removeFrontMatter(mdContent: string): string {
		const regex = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
		return mdContent.replace(regex, '');
	}
	
	function preprocessImageLinks(content: string): string {
		const basePath = `${base}/posts/res`;

		// 替换 Markdown 图片语法
		content = content.replace(/!\[([^\]]*)\]\((\.?\/?res\/[^)]+)\)/g, (_match, alt, path) => {
			const filename = path.replace(/^\.?\/?res\//, ''); // 去掉前缀
			return `![${alt}](${basePath}/${filename})`;
		});

		// 替换 HTML 图片语法
		content = content.replace(/<img\s+([^>]*?)src=["']\.?\/?res\/([^"']+)["']([^>]*?)>/g, (_match, beforeSrc, filename, afterSrc) => {
			return `<img ${beforeSrc}src="${basePath}/${filename}"${afterSrc}>`;
		});

		return content;
	}
	
    const sanitizedContent = $derived(() => {
      const raw = data?.content ?? '';
      if (!raw) return '';
      return removeFrontMatter(preprocessImageLinks(raw));
    });

    const isLocked = $derived(!data.meta?.published && !$authStore.isLoggedIn);
</script>

<svelte:head>
	{#if data.meta}
		<title>{data.meta.title}</title>
		<meta property="og:type" content="article" />
		<meta property="og:title" content={data.meta.title} />
	{/if}
</svelte:head>

{#if data.meta}
	<BlogLayout blog={data.meta}>
        {#if isLocked}
          <div class="rounded-xl border border-dashed border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-800 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
            <div class="mb-2 inline-flex items-center gap-2 text-base font-semibold">
              <Lock class="h-4 w-4" />
              {$t('ui.previewLogin')}
            </div>
            <p>{$t('ui.previewLoginDesc')}</p>
            <p class="mt-2 text-xs text-amber-700 dark:text-amber-200/80">{$t('ui.previewLoginHint')}</p>
          </div>
        {:else}
		  <MarkdownRender content={sanitizedContent} />
        {/if}
	</BlogLayout>
{:else}
	<p>文章加载失败</p>
{/if}
