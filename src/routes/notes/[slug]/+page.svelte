<script lang="ts">
    import { base } from "$app/paths";
    import MarkdownRender from "$lib/components/MarkdownRender.svelte";
	import Container from '$lib/components/container/Container.svelte';


    let { data } = $props();

	function preprocessImageLinks(content: string, bookName: string): string {
		const basePath = `${base}/notes/${bookName}/res`;

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
	
	// 替换图片路径
	if (data?.content && data?.meta?.name) {
		data.content = preprocessImageLinks(data.content, data.meta.name);
	}
</script>

{#if data.meta}
<Container className="mt-16 lg:mt-32">
    <MarkdownRender content={data.content} />
</Container>
{:else}
	<p>文章加载失败</p>
{/if}
