<script lang="ts">
    import BlogLayout from '$lib/components/BlogLayout.svelte';
    import MarkdownRender from "$lib/components/MarkdownRender.svelte";
    import { formatDate } from '$lib/utils/formatDate';
    import { goto } from '$app/navigation';
	import { base } from "$app/paths";

    let { data } = $props();

	function removeFrontMatter(mdContent: string): string {
		const regex = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
		return mdContent.replace(regex, '');
	}
	
	const cleanContent = removeFrontMatter(data.content);

	// 返回按钮处理函数
	function handleBack() {
		// 方式1: 使用浏览器历史记录返回
		if (window.history.length > 1) {
			window.history.back();
		} else {
			// 如果没有历史记录，跳转到首页或博客列表页
			goto('/blog'); // 或者 goto('/')
		}
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
	
	// 替换图片路径
	if (data?.content) {
		data.content = preprocessImageLinks(data.content);
	}
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
		<!-- 返回按钮 -->
		<button
			type="button"
			on:click={handleBack}
			aria-label="Go back to blogs"
			class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20"
		>
			<svg 
				class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" 
				viewBox="0 0 16 16" 
				fill="none" 
				aria-hidden="true"
			>
				<path
					d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<MarkdownRender content={cleanContent} />
	</BlogLayout>
{:else}
	<p>文章加载失败</p>
{/if}

<style>
	/* 确保Tailwind类能正常工作，如果没有Tailwind CSS可以使用以下样式 */
	.group {
		display: flex;
		height: 2.5rem; /* h-10 */
		width: 2.5rem; /* w-10 */
		align-items: center;
		justify-content: center;
		border-radius: 9999px; /* rounded-full */
		background-color: white;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
		border: 1px solid rgba(0, 0, 0, 0.05); /* ring-1 ring-zinc-900/5 */
		transition: all 0.2s ease;
		margin-bottom: 2rem; /* mb-8 */
		cursor: pointer;
	}

	.group:hover {
		border-color: rgba(63, 63, 70, 0.3); /* hover:border-zinc-700 */
	}

	.group svg {
		height: 1rem; /* h-4 */
		width: 1rem; /* w-4 */
		stroke: rgba(113, 113, 122, 1); /* stroke-zinc-500 */
		transition: stroke 0.2s ease;
	}

	.group:hover svg {
		stroke: rgba(63, 63, 70, 1); /* group-hover:stroke-zinc-700 */
	}

	/* 大屏幕定位 */
	@media (min-width: 1024px) { /* lg: */
		.group {
			position: absolute;
			left: -1.25rem; /* -left-5 */
			margin-top: -0.5rem; /* -mt-2 */
			margin-bottom: 0; /* mb-0 */
		}
	}

	@media (min-width: 1280px) { /* xl: */
		.group {
			top: -0.375rem; /* -top-1.5 */
			left: 0; /* left-0 */
			margin-top: 0; /* mt-0 */
		}
	}

	/* 暗色模式支持 */
	@media (prefers-color-scheme: dark) {
		.group {
			background-color: rgba(39, 39, 42, 1); /* dark:bg-zinc-800 */
			border-color: rgba(63, 63, 70, 0.5); /* dark:border-zinc-700/50 */
		}

		.group:hover {
			border-color: rgba(63, 63, 70, 1); /* dark:hover:border-zinc-700 */
		}

		.group:hover svg {
			stroke: rgba(161, 161, 170, 1); /* dark:group-hover:stroke-zinc-400 */
		}
	}
</style>