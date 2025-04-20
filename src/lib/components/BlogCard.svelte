<script>
    import { ChevronRight } from 'lucide-svelte';
    import clsx from 'clsx';
    import { formatDate } from '$lib/utils/formatDate';
    import { base } from '$app/paths';
    
    // 导入 BlogType 类型
    // export type BlogType = {
    //   slug: string;
    //   title: string;
    //   date: string;
    //   description: string;
    // };
    
    // 组件属性
    export let blog;
    export let titleAs = 'h2';
    
    // 确定要渲染的组件类型
    $: TitleComponent = titleAs;
</script>

<!-- 主卡片组件 -->
<article class="group relative flex flex-col items-start">
<!-- 标题部分 -->
<svelte:element this={TitleComponent} class="text-base font-semibold tracking-tight">
    <div>
    <div class="absolute -inset-x-4 -inset-y-6 z-0 scale-95 transition group-hover:scale-100 sm:-inset-x-6 sm:rounded-2xl group-hover:bg-muted/50"></div>
    <a href={`${base}/blogs/${blog.slug}`}>
        <span class="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
        <span class="relative z-10">{blog.title}</span>
    </a>
    </div>
</svelte:element>

<!-- 眉毛部分(日期) -->
<time 
    class="relative z-10 order-first mb-3 flex items-center text-sm text-muted-foreground pl-3.5"
    datetime={blog.date}
>
    <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
    <span class="h-4 w-0.5 rounded-full bg-muted-foreground/30"></span>
    </span>
    {formatDate(blog.date)}
</time>

<!-- 描述部分 -->
<p class="relative z-10 mt-2 text-sm text-muted-foreground">
    {blog.description}
</p>

<!-- CTA部分 -->
<div aria-hidden="true" class="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
    Read blog
    <ChevronRight class="ml-1 h-4 w-4 stroke-current" />
</div>
</article>