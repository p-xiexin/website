<script lang="ts">
    import { base } from "$app/paths";
    import MarkdownRender from "$lib/components/MarkdownRender.svelte";
	import Container from '$lib/components/container/Container.svelte';


    let { data } = $props();

	function preprocessImageLinks(content: string, bookName: string): string {
		return content.replace(/!\[([^\]]*)\]\((\.?\/?res\/[^)]+)\)/g, (_match, alt, path) => {
			const filename = path.replace(/^\.?\/?res\//, ''); // 去掉前缀
			return `![${alt}](${base}/notes/${bookName}/res/${filename})`;
		});
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
