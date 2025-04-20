<script>
    import { Award, ChevronRight, Notebook } from 'lucide-svelte';
    import clsx from 'clsx';
    import { formatDate } from '$lib/utils/formatDate';
    import { blogHeadLine, blogIntro, noteList } from '$lib/config/infoConfig';
    import SimpleLayout from '$lib/components/SimpleLayout.svelte';
    import NoteCard from '$lib/components/NoteCard.svelte';
    import { base } from '$app/paths';
    
    let { data } = $props()

  </script>
  
<SimpleLayout title={blogHeadLine} intro={blogIntro}>
    <div class="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div class="flex max-w-3xl flex-col space-y-16">
            {#each data.posts as blog (blog.slug)}
            <!-- Blog 组件 -->
            <article class="md:grid md:grid-cols-4 md:items-baseline">
                <!-- Card 组件 -->
                <div class="group relative flex flex-col items-start md:col-span-3">
                <!-- Card.Title -->
                <h2 class="text-base font-semibold tracking-tight">
                    <div>
                    <div class="absolute -inset-x-4 -inset-y-6 z-0 scale-95 transition group-hover:scale-100 sm:-inset-x-6 sm:rounded-2xl group-hover:bg-muted/50"></div>
                    <a href={`${base}/blogs/${blog.slug}`}>
                        <span class="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                        <span class="relative z-10">{blog.title}</span>
                    </a>
                    </div>
                </h2>
                
                <!-- Card.Eyebrow (mobile) -->
                <time 
                    datetime={blog.date}
                    class="relative z-10 order-first mb-3 flex items-center text-sm text-muted-foreground pl-3.5 md:hidden"
                >
                    <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                    <span class="h-4 w-0.5 rounded-full bg-muted-foreground/30"></span>
                    </span>
                    {formatDate(blog.date)}
                </time>
                
                <!-- Card.Description -->
                <p class="relative z-10 mt-2 text-sm text-muted-foreground">
                    {blog.description}
                </p>
                
                <!-- Card.Cta -->
                <div aria-hidden="true" class="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
                    Read blog
                    <ChevronRight class="ml-1 h-4 w-4 stroke-current" />
                </div>
                </div>
                
                <!-- Card.Eyebrow (desktop) -->
                <time 
                datetime={blog.date}
                class="relative z-10 order-first mb-3 flex items-center text-sm text-muted-foreground mt-1 hidden md:block"
                >
                {formatDate(blog.date)}
                </time>
            </article>
            {/each}
        </div>
    </div>
    <div class="mx-auto flex flex-col max-w-xl gap-6 lg:max-w-none my-4 py-8 border-t border-muted">
        <h2 class="flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight md:text-3xl opacity-80 mb-4">
            <Notebook size={28}/>
                {'NoteBooks'}
            </h2>
        <ul
        role="list"
        class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 auto-rows-[1fr]"
        >
            {#each noteList as book (book.slug)}
                <NoteCard book={book} titleAs="h3"/>
            {/each}
        </ul>
    </div>
</SimpleLayout>

