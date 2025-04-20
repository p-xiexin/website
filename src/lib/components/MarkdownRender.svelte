<script lang="ts">
    import { Marked, type RendererObject } from "marked";
    import markedKatex from "marked-katex-extension";
    import { markedHighlight } from "marked-highlight";
    import hljs from "highlight.js";
    import 'highlight.js/styles/github.css'
    // import katex from "katex";
    import { onMount } from "svelte";
    import FloatingCatalog from "./FloatingCatalog.svelte";
    
    export let content: string = "";
    
    // Directory structure for the catalog
    let catalog: { title: string; slug: string; children?: { title: string; slug: string }[] }[] = []
    
    const katexOptions = {
        throwOnError: false,
    };

    function slugify(text: string): string {
        return text
            .trim()
            .toLowerCase()
            .normalize('NFD')                           // 分解为基本字母 + 变音符号
            .replace(/[\u0300-\u036f]/g, '')            // 移除变音符号
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, '-')  // 仅保留英文、数字和中文，其他替换为 -
            .replace(/^-+|-+$/g, '');                   // 去除头尾的 -
    }

    const renderer: RendererObject = {
        heading(this, token) {
            const { text, depth } = token;
            const slug = slugify(text);

            if (depth === 2 || depth === 3) {
                return `<h${depth} id="${slug}">${text}</h${depth}>`;
            }

            return `<h${depth}>${text}</h${depth}>`;
        }
    };
    const marked = new Marked();
    marked.use(
        markedHighlight({
            highlight(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
        }),
        markedKatex(katexOptions),
        { renderer }
    );

    let div: HTMLDivElement;

    // Function to generate catalog from the markdown content
    function generateCatalog(content: string) {
        const headings: any[] = [];
        const regex = /^(##+)\s+(.+)$/gm;
        let match;

        while ((match = regex.exec(content)) !== null) {
            const level = match[1].length;
            const title = match[2].trim();
            const slug = slugify(title);

            if (level === 2) {
                headings.push({ title, slug, children: [] });
            } else if (level === 3 && headings.length > 0) {
                headings[headings.length - 1].children.push({ title, slug });
            }
        }

        catalog = headings;
    }    
    
    // Function to add copy buttons to code blocks
    function addCopyButtons() {
        if (!div) return;
        
        const codeBlocks = div.querySelectorAll('pre code');
        
        codeBlocks.forEach((codeBlock, index) => {
            const pre = codeBlock.parentNode as HTMLElement;
            if (!pre || pre.tagName !== 'PRE') return;
            
            // Create wrapper to contain the pre and button
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper relative';
            pre.parentNode?.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            
            // Create copy button (using text instead of image)
            const copyButton = document.createElement('button');
            copyButton.innerText = 'COPY';
            copyButton.className = 'copy-button absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded cursor-pointer';
            copyButton.title = 'Copy to clipboard';
            
            copyButton.addEventListener('click', () => {
                const code = codeBlock.textContent || '';
                navigator.clipboard.writeText(code).then(() => {
                    // Change button text to "COPIED!"
                    copyButton.innerText = 'COPIED!';
                    copyButton.title = 'Copied!';
                    
                    // Reset button text to "COPY" after 2 seconds
                    setTimeout(() => {
                        copyButton.innerText = 'COPY';
                        copyButton.title = 'Copy to clipboard';
                    }, 2000); // 2 seconds
                });
            });
            
            wrapper.appendChild(copyButton);
        });
    }
    
    // Use onMount to ensure DOM is ready
    onMount(() => {
        generateCatalog(content);  // Generate catalog when the component mounts
        addCopyButtons();
    });

    
    // When content changes, we need to re-render and re-add the buttons
    $: if (content) {
        setTimeout(() => {
            generateCatalog(content);  // Re-generate catalog when content changes
            addCopyButtons();
        }, 0);
    }
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
        crossorigin="anonymous"
    />
</svelte:head>

<div class="prose dark:prose-invert max-w-none" bind:this={div}>
    {@html marked.parse(content)}
</div>

<FloatingCatalog {catalog}/>

<style>
    /* Style for the code block wrapper */
    :global(.code-block-wrapper) {
        position: relative;
        margin-bottom: 1rem;
    }
    
    /* Ensure pre has padding for the button */
    :global(.code-block-wrapper pre) {
        padding-right: 3rem;
    }
    
    /* Copy button styles */
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
</style>
