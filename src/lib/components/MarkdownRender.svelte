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

    let fontSize = 16;
    let lineHeight = 1.5;

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
        wrapper.className = "code-block-wrapper";

        const header = document.createElement("div");
        header.className = "code-block-header";

        const label = document.createElement("span");
        label.className = "code-block-language";
        label.textContent = language;

        const btn = document.createElement("button");
        btn.className = "code-copy-button";
        btn.setAttribute("aria-label", "Copy code");

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

<div class="markdown-frame">
    {#if extractedTitle}
        <div class="markdown-title-row">
            <ReaderSettings bind:fontSize bind:lineHeight />
            <h1>{@html extractedTitle}</h1>
        </div>
    {/if}

    <div
        bind:this={containerElement}
        style="--user-fs:{fontSize}px;--user-lh:{lineHeight}"
        class="reader-content markdown-body">
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

:global(.reader-content h2) {
    margin-top: 1.65em;
    margin-bottom: 0.55em;
    padding-bottom: 0.25em;
    border-bottom: 1px solid hsl(var(--border));
    color: hsl(var(--primary));
    font-size: 1.35em;
}

:global(.reader-content h3) {
    margin-top: 1.35em;
    margin-bottom: 0.45em;
    font-size: 1.12em;
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

.markdown-frame { position: relative; width: 100%; color: #1f2328; }
.markdown-title-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 24px; padding-bottom: 10px; border-bottom: 1px solid #d0d7de; }
.markdown-title-row h1 { flex: 1; margin: 0; color: #1f2328; font-size: 2em; font-weight: 600; line-height: 1.25; letter-spacing: -0.02em; }
:global(.dark) .markdown-frame { color: #f0f6fc; }
:global(.dark) .markdown-title-row { border-color: #3d444d; }
:global(.dark) .markdown-title-row h1 { color: #f0f6fc; }

:global(.markdown-body) { color: #1f2328; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", Helvetica, Arial, sans-serif; font-size: var(--user-fs); line-height: var(--user-lh); overflow-wrap: break-word; }
:global(.dark .markdown-body) { color: #f0f6fc; }
:global(.markdown-body > :first-child) { margin-top: 0 !important; }
:global(.markdown-body > :last-child) { margin-bottom: 0 !important; }
:global(.markdown-body p), :global(.markdown-body blockquote), :global(.markdown-body ul), :global(.markdown-body ol), :global(.markdown-body table), :global(.markdown-body pre), :global(.markdown-body details) { margin-top: 0; margin-bottom: 16px; }
:global(.markdown-body h1), :global(.markdown-body h2), :global(.markdown-body h3), :global(.markdown-body h4), :global(.markdown-body h5), :global(.markdown-body h6) { margin-top: 24px; margin-bottom: 16px; color: inherit; font-weight: 600; line-height: 1.25; }
:global(.markdown-body h1) { padding-bottom: 0.3em; border-bottom: 1px solid #d8dee4; font-size: 2em; }
:global(.markdown-body h2) { padding-bottom: 0.3em; border-bottom: 1px solid #d8dee4; color: inherit; font-size: 1.5em; }
:global(.markdown-body h3) { color: inherit; font-size: 1.25em; }
:global(.markdown-body h4) { font-size: 1em; }
:global(.dark .markdown-body h1), :global(.dark .markdown-body h2) { border-color: #3d444d; }
:global(.markdown-body a) { color: #0969da; text-decoration: none; }
:global(.markdown-body a:hover) { text-decoration: underline; }
:global(.dark .markdown-body a) { color: #4493f8; }
:global(.markdown-body strong) { font-weight: 600; }
:global(.markdown-body ul), :global(.markdown-body ol) { padding-left: 2em; }
:global(.markdown-body li + li) { margin-top: 0.25em; }
:global(.markdown-body blockquote) { padding: 0 1em; border-left: 0.25em solid #d0d7de; color: #59636e; }
:global(.markdown-body blockquote > :last-child) { margin-bottom: 0; }
:global(.dark .markdown-body blockquote) { border-color: #3d444d; color: #9198a1; }
:global(.markdown-body hr) { height: 0.25em; margin: 24px 0; padding: 0; border: 0; background: #d8dee4; }
:global(.dark .markdown-body hr) { background: #3d444d; }
:global(.markdown-body code:not(pre code)) { margin: 0; padding: 0.2em 0.4em; border-radius: 6px; background: #eff1f3; font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; font-size: 85%; }
:global(.dark .markdown-body code:not(pre code)) { background: #656c7633; }
:global(.markdown-body pre) { overflow: auto; padding: 16px; border-radius: 6px; background: #f6f8fa; font: 85%/1.45 ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
:global(.dark .markdown-body pre) { background: #151b23; }
:global(.markdown-body pre code) { padding: 0; border: 0; background: transparent; font: inherit; }
:global(.markdown-body table) { display: block; width: max-content; max-width: 100%; overflow: auto; border-spacing: 0; border-collapse: collapse; }
:global(.markdown-body th), :global(.markdown-body td) { padding: 6px 13px; border: 1px solid #d0d7de; }
:global(.markdown-body th) { font-weight: 600; background: #f6f8fa; }
:global(.markdown-body tr:nth-child(2n)) { background: #f6f8fa; }
:global(.dark .markdown-body th), :global(.dark .markdown-body td) { border-color: #3d444d; }
:global(.dark .markdown-body th), :global(.dark .markdown-body tr:nth-child(2n)) { background: #151b23; }
:global(.markdown-body img) { box-sizing: content-box; max-width: 100%; background: transparent; }
:global(.markdown-body input[type="checkbox"]) { margin: 0 0.2em 0.25em -1.4em; vertical-align: middle; }

:global(.code-block-wrapper) { position: relative; margin: 16px 0; overflow: hidden; border: 1px solid #d0d7de; border-radius: 6px; background: #f6f8fa; }
:global(.dark .code-block-wrapper) { border-color: #3d444d; background: #151b23; }
:global(.code-block-header) { display: flex; min-height: 34px; align-items: center; justify-content: space-between; padding: 0 8px 0 12px; border-bottom: 1px solid #d8dee4; color: #59636e; background: #f6f8fa; }
:global(.dark .code-block-header) { border-color: #3d444d; color: #9198a1; background: #151b23; }
:global(.code-block-language) { font: 600 11px/1 ui-monospace, SFMono-Regular, Consolas, monospace; text-transform: uppercase; }
:global(.code-copy-button) { display: grid; width: 26px; height: 26px; place-items: center; border: 1px solid transparent; border-radius: 6px; color: #59636e; cursor: pointer; }
:global(.code-copy-button:hover) { border-color: #d0d7de; background: #f3f4f6; color: #1f2328; }
:global(.dark .code-copy-button:hover) { border-color: #3d444d; background: #212830; color: #f0f6fc; }
:global(.code-copy-button svg) { width: 16px; height: 16px; }
:global(.code-block-wrapper pre) { margin: 0 !important; border-radius: 0; background: transparent !important; }

@media (max-width: 640px) {
    .markdown-title-row { margin-bottom: 18px; }
    .markdown-title-row h1 { font-size: 1.65em; }
    :global(.markdown-body) { font-size: max(15px, var(--user-fs)); }
    :global(.markdown-body h1) { font-size: 1.7em; }
    :global(.markdown-body h2) { font-size: 1.35em; }
    :global(.markdown-body ul), :global(.markdown-body ol) { padding-left: 1.5em; }
}
</style>
