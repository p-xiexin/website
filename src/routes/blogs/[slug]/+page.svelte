<script lang="ts">
    import BlogLayout from '$lib/components/BlogLayout.svelte';
    import ColumnPosts from '$lib/components/ColumnPosts.svelte';
    import MarkdownRender from "$lib/components/MarkdownRender.svelte";
    import { base } from "$app/paths";
    import { setContext } from 'svelte';

    let { data } = $props();

	// 设置 context：从哪来的，比如列表页的 URL
	setContext('previousPathname', '/blog');

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
	
	const processedContent = $derived(data?.content ? preprocessImageLinks(data.content) : '');
	const cleanContent = $derived(removeFrontMatter(processedContent));
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
		{#if data.meta.column}
			<ColumnPosts columnName={data.meta.column.name} posts={data.columnPosts} currentSlug={data.meta.slug} />
		{/if}
		<MarkdownRender content={cleanContent} />
	</BlogLayout>
{:else}
	<p>文章加载失败</p>
{/if}
