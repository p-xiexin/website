<script lang="ts">
    import BlogLayout from '$lib/components/BlogLayout.svelte';
    import MarkdownRender from "$lib/components/MarkdownRender.svelte";
    import { formatDate } from '$lib/utils/formatDate';

    let { data } = $props();

	function removeFrontMatter(mdContent: string): string {
        const regex = /^---\n[\s\S]+?\n---\n/;
        return mdContent.replace(regex, '');
    }
	const cleanContent = removeFrontMatter(data.content);
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
		<MarkdownRender content={cleanContent} />
	</BlogLayout>
{:else}
	<p>文章加载失败</p>
{/if}
