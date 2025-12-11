<script lang="ts">
    import { onMount, tick } from "svelte";
    import FloatingCatalog from "./FloatingCatalog.svelte";
    import ReaderSettings from "./ReaderSettings.svelte";
    import { slide } from "svelte/transition";
    
    // Unified / Remark / Rehype ecosystem
    import { unified } from "unified";
    import remarkParse from "remark-parse";
    import remarkMath from "remark-math";
    import remarkGfm from 'remark-gfm';
    import remarkRehype from "remark-rehype";
    import rehypeKatex from "rehype-katex";
    import rehypeHighlight from "rehype-highlight";
    import rehypeSlug from "rehype-slug";
    import rehypeStringify from "rehype-stringify";
    
    import "katex/dist/katex.min.css";
    import { theme } from "$lib/stores";
    import GitHubSlugger from 'github-slugger';
    
    // Highlight.js Languages
    import type { LanguageFn } from 'highlight.js';
    import bash from 'highlight.js/lib/languages/bash';
    import c from 'highlight.js/lib/languages/c';
    import cpp from 'highlight.js/lib/languages/cpp';
    import cmake from 'highlight.js/lib/languages/cmake';
    import javascript from 'highlight.js/lib/languages/javascript';
    import typescript from 'highlight.js/lib/languages/typescript';
    import json from 'highlight.js/lib/languages/json';
    import python from 'highlight.js/lib/languages/python';
    import markdown from 'highlight.js/lib/languages/markdown';
    
    const markdownLanguage = markdown as unknown as LanguageFn;
    const highlightLanguages: Record<string, LanguageFn> = {
        bash, shell: bash,
        c, cpp, cmake,
        js: javascript, javascript,
        ts: typescript, typescript,
        json, python,
        md: markdownLanguage, markdown: markdownLanguage,
    };

    export let content: string = "";

    let catalog: { title: string; slug: string; children?: { title: string; slug: string }[] }[] = [];
    let renderedContent: string = "";
    let extractedTitle: string = "";
    let containerElement: HTMLDivElement;

    // Reader Settings
    let fontSize = 18;
    let lineHeight = 1.8;

    // Preprocess content to fix common Markdown syntax issues
    function preprocessContent(text: string) {
        if (!text) return "";
        // Force replace **text** with <strong>text</strong>.
        // This effectively bypasses CommonMark's strict flanking/punctuation rules which often fail
        // for CJK text mixtures (e.g. bold ending with punctuation followed by CJK character).
        return text.replace(/\*\*\s*([^\*]+?)\s*\*\*/g, '<strong>$1</strong>');
    }

    function generateCatalog(markdownText: string) {
        const headings: any[] = [];
        const slugger = new GitHubSlugger();
        const regex = /^(##+)\s+(.+)$/gm;
        let match;

        while ((match = regex.exec(markdownText)) !== null) {
            const level = match[1].length;
            const title = match[2].trim();
            const slug = slugger.slug(title);

            if (level === 2) {
                headings.push({ title, slug, children: [] });
            } else if (level === 3 && headings.length > 0) {
                headings[headings.length - 1].children.push({ title, slug });
            }
        }
        return headings;
    }

    async function renderMarkdown(text: string) {
        const processedText = preprocessContent(text);
        
        // Extract Title (H1) manually to render it alongside the settings button
        const titleRegex = /^#\s+(.+)$/m;
        const titleMatch = processedText.match(titleRegex);
        let contentBody = processedText;

        if (titleMatch) {
            extractedTitle = titleMatch[1];
            // Remove the title from the body so it isn't rendered twice
            contentBody = processedText.replace(titleRegex, '');
        } else {
            extractedTitle = "";
        }
        
        const file = await unified()
            .use(remarkParse)
            .use(remarkMath)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypeKatex)
            .use(rehypeHighlight as any, {
                ignoreMissing: true,
                languages: highlightLanguages,
            })
            .use(rehypeSlug)
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(contentBody);
        
        // Generate catalog from the full processed text to maintain heading hierarchy logic
        catalog = generateCatalog(processedText);
        return String(file);
    }
    
    // Enhanced Code Block Rendering (Mac-style window)
    function enhanceCodeBlocks() {
        if (!containerElement) return;
        
        const codeBlocks = containerElement.querySelectorAll('pre code');
        
        codeBlocks.forEach((codeElement) => {
            const pre = codeElement.parentNode as HTMLElement;
            if (!pre || pre.tagName !== 'PRE') return;
            
            // Prevent double enhancement
            const parent = pre.parentNode as HTMLElement;
            if (parent.classList.contains('code-block-wrapper')) return;
            
            // Detect Language
            let language = 'text';
            codeElement.classList.forEach(cls => {
                if (cls.startsWith('language-')) {
                    language = cls.replace('language-', '');
                }
            });

            // Create Container Wrapper
            const wrapper = document.createElement('div');
            // Updated to VS Code style: #1e1e1e background, #333333 border
            wrapper.className = 'code-block-wrapper my-6 rounded-xl overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333333] shadow-sm';
            
            // Create Header Bar
            const header = document.createElement('div');
            // Updated to VS Code Panel header style: #252526 background
            header.className = 'flex items-center justify-between px-4 py-2 bg-[#f6f8fa] dark:bg-[#252526] border-b border-gray-200 dark:border-[#333333]';
            
            // Language Badge
            const langLabel = document.createElement('span');
            langLabel.className = 'text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 uppercase select-none';
            langLabel.innerText = language;

            // Copy Button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'cursor-pointer group flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all focus:outline-none';
            copyBtn.setAttribute('aria-label', 'Copy code');
            copyBtn.innerHTML = `
                <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            `;
            
            copyBtn.addEventListener('click', async () => {
                const code = codeElement.textContent || '';
                try {
                    await navigator.clipboard.writeText(code);
                    copyBtn.innerHTML = `<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
                    setTimeout(() => {
                        copyBtn.innerHTML = `
                            <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        `;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy', err);
                }
            });

            header.appendChild(langLabel);
            header.appendChild(copyBtn);
            
            // Insert into DOM
            parent.insertBefore(wrapper, pre);
            wrapper.appendChild(header);
            wrapper.appendChild(pre);
            
            // Reset PRE styles to avoid conflict with wrapper
            pre.style.margin = '0';
            pre.style.border = 'none';
            pre.style.borderRadius = '0';
            pre.style.background = 'transparent'; 
        });
    }

    async function processContent() {
        if (!content) return;
        renderedContent = await renderMarkdown(content);
        await tick();
        enhanceCodeBlocks();
    }
    
    $: content && processContent();
</script>


<div class="relative w-full max-w-none group/page">
    <!-- Header Section with Settings and Title -->
    {#if extractedTitle}
        <!-- Flex layout: Button on left, Title on right. 
             This ensures the button is "inline" with the title but stays independent in layout 
             so wrapping titles don't cover it. -->
        <div class="flex items-start gap-3 mb-8">
            <div class="mt-1 shrink-0 print:hidden">
                <ReaderSettings bind:fontSize bind:lineHeight align="left" />
            </div>
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white m-0 leading-tight">
                {@html extractedTitle}
            </h1>
        </div>
    {:else}
        <!-- Fallback if no H1 found: Button just sits at top -->
        <div class="flex justify-start mb-4 print:hidden">
            <ReaderSettings bind:fontSize bind:lineHeight align="left" />
        </div>
    {/if}

    <!-- Main Content -->
    <div 
        bind:this={containerElement}
        style="--user-fs: {fontSize}px; --user-lh: {lineHeight};"
        class="
            reader-content
            prose prose-lg dark:prose-invert 
            w-full max-w-none
            
            /* Heading Typography */
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-h1:text-4xl prose-h1:mb-8
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            
            /* Paragraphs */
            prose-p:leading-7 prose-p:text-gray-700 dark:prose-p:text-gray-300
            
            /* Strong (Bold) */
            prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
            
            /* Links */
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            
            /* Blockquotes */
            prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
            prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 
            prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-500
            
            /* Inline Code - GitHub Style */
            prose-code:font-mono prose-code:font-normal prose-code:text-[0.875em] 
            prose-code:text-gray-900 dark:prose-code:text-gray-200
            prose-code:bg-gray-100 dark:prose-code:bg-[rgba(110,118,129,0.4)]
            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
            prose-code:before:content-[''] prose-code:after:content-['']
            
            /* Images */
            prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto prose-img:my-8
            
            /* Tables */
            prose-th:p-3 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:text-gray-700 dark:prose-th:text-gray-200
            prose-td:p-3 prose-td:border-b prose-td:border-gray-100 dark:prose-td:border-gray-800
            
            /* Lists */
            prose-li:marker:text-gray-400
        "
    >
        {@html renderedContent}
    </div>
</div>

<FloatingCatalog {catalog}/>

<!-- Dynamic Highlight.js Styles -->
{#if $theme === 'dark'}
  <style>
    @import 'highlight.js/styles/vs2015.css';
  </style>
{:else}
  <style>
    @import 'highlight.js/styles/github.css';
  </style>
{/if}

<style>
    /* User Preference Overrides */
    /* We use specificity to override Tailwind's prose defaults for readability settings */
    :global(.reader-content p), 
    :global(.reader-content ul), 
    :global(.reader-content ol), 
    :global(.reader-content li),
    :global(.reader-content blockquote) {
        font-size: var(--user-fs) !important;
        line-height: var(--user-lh) !important;
    }

    /* Styling overrides for the code block internals */
    :global(.code-block-wrapper pre) {
        padding: 1rem 1.25rem;
        overflow-x: auto;
        font-size: 0.875rem;
        line-height: 1.7;
    }

    /* 
      CRITICAL: Override Highlight.js default background.
      The wrapper controls the background now. 
      This prevents the "layered" look.
    */
    :global(.code-block-wrapper .hljs) {
        background: transparent !important;
        padding: 0;
    }
    
    /* Ensure math equations don't break layout on mobile */
    :global(.katex-display) {
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0.5rem 0;
        max-width: 100%;
    }
</style>