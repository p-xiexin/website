<script lang="ts">
    import { base } from "$app/paths";
    import Container from '$lib/components/container/Container.svelte';
    import { onMount } from "svelte";
    import FloatingCatalog from "$lib/components/FloatingCatalog.svelte";

    let html = '';
    let catalog = [];
    let isLoading = true;

    onMount(async () => {
        try {
            // 并行加载，但立即开始显示
            const [resHtml, resToc] = await Promise.all([
                fetch(`/generated/SLAM/index.html`),
                fetch(`/generated/SLAM/index.toc.json`)
            ]);
            
            html = await resHtml.text();
            catalog = await resToc.json();
            
            // 关键：延迟设置 isLoading 为 false，让浏览器有时间准备
            requestAnimationFrame(() => {
                isLoading = false;
            });
            
        } catch (error) {
            console.error('Loading failed:', error);
            isLoading = false;
        }
    });
</script>

{#if isLoading}
    <!-- 简单的加载提示 -->
    <Container className="mt-16 lg:mt-32">
        <div class="text-center py-20">
            <div class="animate-pulse text-gray-500">加载中...</div>
        </div>
    </Container>
{:else if html}
    <Container className="mt-16 lg:mt-32">
        <!-- 关键优化：使用 CSS 控制渲染性能 -->
        <article class="mobile-optimized-content">
            {@html html}
        </article>
        <FloatingCatalog {catalog}/>
    </Container>
{:else}
    <Container className="mt-16 lg:mt-32">
        <p class="text-center text-red-500">文章加载失败</p>
    </Container>
{/if}

<style>
    /* 移动端性能优化的关键CSS */
    .mobile-optimized-content {
        /* 启用硬件加速 */
        transform: translateZ(0);
        will-change: scroll-position;
        
        /* 优化文本渲染 */
        text-rendering: optimizeSpeed;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        
        /* 减少重排重绘 */
        contain: layout style;
    }

    /* 移动端专用样式 */
    @media (max-width: 768px) {
        .mobile-optimized-content {
            /* 减少复杂的样式计算 */
            font-size: 16px;
            line-height: 1.6;
            
            /* 简化排版 */
            :global(h1, h2, h3, h4, h5, h6) {
                margin: 1.5em 0 0.5em 0;
                line-height: 1.3;
            }
            
            :global(p) {
                margin: 0 0 1em 0;
            }
            
            /* 优化图片 */
            :global(img) {
                width: 100%;
                height: auto;
                /* 防止布局抖动 */
                aspect-ratio: attr(width) / attr(height);
                object-fit: contain;
                /* 延迟加载 */
                loading: lazy;
            }
            
            
            /* 优化表格 */
            :global(table) {
                width: 100%;
                overflow-x: auto;
                display: block;
                white-space: nowrap;
            }
            
            /* 移除复杂的阴影和动画 */
            :global(*) {
                box-shadow: none !important;
                transition: none !important;
                animation: none !important;
            }
        }
    }


</style>