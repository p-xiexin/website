<script lang="ts">
    import { onMount } from "svelte";
    import FloatingCatalog from "./FloatingCatalog.svelte";
    import rehypeKatex from "rehype-katex";
    import remarkMath from "remark-math";
    import remarkParse from "remark-parse";
    import remarkRehype from "remark-rehype";
    import remarkGfm from 'remark-gfm'
    import rehypeStringify from "rehype-stringify";
    import rehypeHighlight from "rehype-highlight";
    import rehypeSlug from "rehype-slug";
    import { unified } from "unified";
    import "katex/dist/katex.min.css";
    import { theme } from "$lib/stores";
    import GitHubSlugger from 'github-slugger';
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
        markdown: markdownLanguage,
    };

    export let content: string = "";

    // 目录结构
    let catalog: { title: string; slug: string; children?: { title: string; slug: string }[] }[] = [];
    let renderedContent: string = "";
    let div: HTMLDivElement;
    let tocElement: HTMLElement | null = null;

    function generateCatalog(content: string) {
        const headings: any[] = [];
        const slugger = new GitHubSlugger();
        const regex = /^(##+)\s+(.+)$/gm;
        let match;

        while ((match = regex.exec(content)) !== null) {
            const level = match[1].length;
            const title = match[2].trim();
            const slug = slugger.slug(title);  // 使用 github-slugger 生成 slug

            if (level === 2) {
                headings.push({ title, slug, children: [] });
            } else if (level === 3 && headings.length > 0) {
                headings[headings.length - 1].children.push({ title, slug });
            }
        }

        return headings;
    }

    async function renderMarkdown(markdown: string) {
        const result = await unified()
            .use(remarkParse)  // 解析Markdown
            .use(remarkMath)   // 支持数学公式
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true }) // 转换为HTML，保留原始HTML标签
            .use(rehypeKatex)  // 渲染数学公式
            // rehype-highlight types don't expose languages map; cast to any for custom registrations
            .use(rehypeHighlight as unknown as any, {
                ignoreMissing: true,
                languages: highlightLanguages,
            }) // 代码高亮
            .use(rehypeSlug)   // 为标题添加ID
            // .use(rehypeToc, {
            //     nav: true,       // 将TOC包装在<nav>标签中
            //     headings: ['h2', 'h3'], // 包含h2和h3标题
            //     cssClasses: {
            //         toc: 'page-outline', // TOC容器的CSS类
            //         link: 'toc-link'     // TOC链接的CSS类
            //     }
            // })
            .use(rehypeStringify, { allowDangerousHtml: true }) // 转换为HTML字符串
            .process(markdown);
        
        // 提取目录内容
        catalog = generateCatalog(markdown);
        
        return String(result);
    }
    
    // 添加代码块复制按钮
    function addCopyButtons() {
        if (!div) return;
        
        const codeBlocks = div.querySelectorAll('pre code');
        
        codeBlocks.forEach((codeBlock) => {
            const pre = codeBlock.parentNode as HTMLElement;
            if (!pre || pre.tagName !== 'PRE') return;
            
            // 正确的类型检查
            const parent = pre.parentNode;
            if (!parent || !(parent instanceof HTMLElement) || parent.classList.contains('code-block-wrapper')) return;
            
            // 创建包装器
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper relative';
            parent.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            
            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.innerText = 'COPY';
            copyButton.className = 'copy-button absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded cursor-pointer';
            copyButton.title = '复制到剪贴板';
            
            copyButton.addEventListener('click', () => {
                const code = codeBlock.textContent || '';
                navigator.clipboard.writeText(code).then(() => {
                    copyButton.innerText = 'COPIED!';
                    copyButton.title = '已复制!';
                    
                    setTimeout(() => {
                        copyButton.innerText = 'COPY';
                        copyButton.title = '复制到剪贴板';
                    }, 2000);
                });
            });
            
            wrapper.appendChild(copyButton);
        });
    }

    // 查找目录元素
    function findTocElement() {
        if (!div) return;
        
        // 查找 rehype-toc 生成的目录元素
        tocElement = div.querySelector('nav.page-outline') || div.querySelector('.page-outline');
        
        if (!tocElement) {
            // 如果没有找到自动生成的目录，可以查找第一个 h2 作为参考点
            tocElement = div.querySelector('h2');
        }
    }
    
    // 处理Markdown内容变化
    async function processContent() {
        if (!content) return;
        
        // 渲染Markdown
        renderedContent = await renderMarkdown(content);
        
        // 生成目录和添加复制按钮（在DOM更新后）
        setTimeout(() => {
            addCopyButtons();
            findTocElement();
        }, 0);
    }
    
    onMount(() => {
        // 处理异步内容
        processContent();
    });
    
    // 监视内容变化
    $: content && processContent();
</script>


<div class="prose dark:prose-invert max-w-none" bind:this={div}>
    {@html renderedContent}
</div>

<FloatingCatalog {catalog}/>

{#if $theme === 'dark'}
  <style>
    @import 'highlight.js/styles/github-dark.css';
  </style>
{:else}
  <style>
    @import 'highlight.js/styles/github.css';
  </style>
{/if}

<style>
    /* 代码块包装器样式 */
    :global(.code-block-wrapper) {
        position: relative;
        margin-bottom: 1rem;
    }
    
    /* 确保pre有足够的右侧填充以容纳按钮 */
    :global(.code-block-wrapper pre) {
        padding-right: 3rem;
    }
    
    /* 复制按钮样式 */
    :global(.copy-button) {
        opacity: 0.7;
        transition: opacity 0.2s;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: bold;
    }
    
    :global(.copy-button:hover) {
        opacity: 1;
    }
    /* 添加图片居中样式 */
    :global(.prose img) {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    /* 重写代码块的样式 */
    /* :global(.prose pre) {
        background-color: transparent !important;
        padding: 1rem;
        border-radius: 0.375rem;
        border: 1px solid #e5e7eb;
        margin: 1rem 0;
    } */
    
    /* 重写代码文本的样式 */
    /* :global(.prose code) {
        color: inherit !important;
        background-color: transparent !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    } */
    
    /* 保留代码高亮类的样式，但重写背景色 */
    :global(.hljs) {
        background-color: transparent !important;
        padding: 0 !important;
    }
    /* 防止公式溢出（移动端） */
    @media (max-width: 768px) {
      :global(.katex-display) {
        overflow-x: auto;
        overflow-y: hidden;
        max-width: 100%;
        display: block;
      }
    }
</style>
