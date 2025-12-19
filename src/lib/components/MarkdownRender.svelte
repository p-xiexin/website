<script lang="ts">
    import { tick } from "svelte";
    import FloatingCatalog from "./FloatingCatalog.svelte";
    import ReaderSettings from "./ReaderSettings.svelte";

    import { unified } from "unified";
    import remarkParse from "remark-parse";
    import remarkMath from "remark-math";
    import remarkGfm from "remark-gfm";
    import remarkRehype from "remark-rehype";
    import rehypeKatex from "rehype-katex";
    import rehypeHighlight from "rehype-highlight";
    import rehypeSlug from "rehype-slug";
    import rehypeStringify from "rehype-stringify";

    import "katex/dist/katex.min.css";
    import { theme } from "$lib/stores";
    import GitHubSlugger from "github-slugger";

    import type { LanguageFn } from "highlight.js";
    import bash from "highlight.js/lib/languages/bash";
    import c from "highlight.js/lib/languages/c";
    import cpp from "highlight.js/lib/languages/cpp";
    import cmake from "highlight.js/lib/languages/cmake";
    import javascript from "highlight.js/lib/languages/javascript";
    import typescript from "highlight.js/lib/languages/typescript";
    import json from "highlight.js/lib/languages/json";
    import python from "highlight.js/lib/languages/python";
    import markdown from "highlight.js/lib/languages/markdown";

    const markdownLanguage = markdown as unknown as LanguageFn;
    const highlightLanguages: Record<string, LanguageFn> = {
        bash,
        shell: bash,
        c,
        cpp,
        cmake,
        js: javascript,
        javascript,
        ts: typescript,
        typescript,
        json,
        python,
        md: markdownLanguage,
        markdown: markdownLanguage
    };

    export let content = "";

    let renderedContent = "";
    let extractedTitle = "";
    let catalog: any[] = [];
    let containerElement: HTMLDivElement;

    let fontSize = 18;
    let lineHeight = 1.8;

    function preprocessContent(text: string) {
        return text.replace(/\*\*\s*([^\*]+?)\s*\*\*/g, "<strong>$1</strong>");
    }

    function generateCatalog(markdownText: string) {
        const headings: any[] = [];
        const slugger = new GitHubSlugger();
        const regex = /^(##+)\s+(.+)$/gm;
        let match;

        while ((match = regex.exec(markdownText))) {
            const level = match[1].length;
            const title = match[2].trim();
            const slug = slugger.slug(title);

            if (level === 2) {
                headings.push({ title, slug, children: [] });
            } else if (level === 3 && headings.length) {
                headings[headings.length - 1].children.push({ title, slug });
            }
        }
        return headings;
    }

    async function renderMarkdown(text: string) {
        const processed = preprocessContent(text);

        const titleMatch = processed.match(/^#\s+(.+)$/m);
        let body = processed;

        if (titleMatch) {
            extractedTitle = titleMatch[1];
            body = processed.replace(/^#\s+(.+)$/m, "");
        }

        const file = await unified()
            .use(remarkParse)
            .use(remarkMath)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeKatex)
            .use(rehypeHighlight as any, {
                ignoreMissing: true,
                languages: highlightLanguages
            })
            .use(rehypeSlug)
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(body);

        catalog = generateCatalog(processed);
        return String(file);
    }

    function enhanceSingleCodeBlock(code: HTMLElement) {
        const pre = code.parentElement;
        if (!pre || pre.parentElement?.classList.contains("code-block-wrapper")) return;

        let language = "text";
        code.classList.forEach(cls => {
            if (cls.startsWith("language-")) language = cls.replace("language-", "");
        });

        const wrapper = document.createElement("div");
        wrapper.className =
            "code-block-wrapper my-6 rounded-xl overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333333] shadow-sm";

        const header = document.createElement("div");
        header.className =
            "flex items-center justify-between px-4 py-2 bg-[#f6f8fa] dark:bg-[#252526] border-b border-gray-200 dark:border-[#333333]";

        const label = document.createElement("span");
        label.className =
            "text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 uppercase";
        label.textContent = language;

        const btn = document.createElement("button");
        btn.className =
            "group p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition";

        btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>`;

        btn.onclick = async () => {
            await navigator.clipboard.writeText(code.textContent || "");
        };

        header.append(label, btn);
        pre.parentElement!.insertBefore(wrapper, pre);
        wrapper.append(header, pre);

        pre.style.margin = "0";
        pre.style.background = "transparent";
    }

    function lazyEnhanceCodeBlocks() {
        if (typeof window === "undefined") return;
        const blocks = containerElement.querySelectorAll("pre code");

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        enhanceSingleCodeBlock(entry.target as HTMLElement);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "200px" }
        );

        blocks.forEach(b => observer.observe(b));
    }

    async function processContent() {
        renderedContent = await renderMarkdown(content);
        await tick();
        lazyEnhanceCodeBlocks();
    }

    $: content && processContent();
</script>

<div class="relative w-full">
    {#if extractedTitle}
        <div class="flex gap-3 mb-8">
            <ReaderSettings bind:fontSize bind:lineHeight />
            <h1 class="text-4xl font-bold">{@html extractedTitle}</h1>
        </div>
    {/if}

    <div
        bind:this={containerElement}
        style="--user-fs:{fontSize}px;--user-lh:{lineHeight}"
        class="reader-content prose prose-lg dark:prose-invert max-w-none">
        {@html renderedContent}
    </div>
</div>

<FloatingCatalog {catalog} />

{#if $theme === "dark"}
<style>@import "highlight.js/styles/vs2015.css";</style>
{:else}
<style>@import "highlight.js/styles/github.css";</style>
{/if}

<style>
:global(.reader-content p),
:global(.reader-content li),
:global(.reader-content blockquote) {
    font-size: var(--user-fs);
    line-height: var(--user-lh);
}

/* 代码高亮背景由 wrapper 控制 */
:global(.code-block-wrapper .hljs) {
    background: transparent !important;
}

/* ✅ 关键：数学公式禁止纵向滚动 */
:global(.katex-display) {
    overflow-x: auto;
    overflow-y: hidden !important;
    max-width: 100%;
    padding: 0.5rem 0;
}
</style>
