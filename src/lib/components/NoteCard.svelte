<script>
    import { base } from '$app/paths';
    import { Book, HashIcon } from 'lucide-svelte';
    
    // Define props
    export let book;
    export let titleAs = 'h2';
    
    // Dynamic component
    $: Component = titleAs;
  </script>
  
  <li class="group relative flex flex-col items-start h-full">
    <div class="relative flex flex-col justify-between h-full w-full py-5 px-6 rounded-2xl border border-muted-foreground/20 shadow-sm transition-all group-hover:scale-[1.03] group-hover:shadow-md group-hover:bg-muted/5">
      <div>
        <div class="flex flex-col sm:flex-row justify-center sm:justify-start items-start sm:items-center gap-2">
          <Book size={20} />
          <svelte:element this={Component} class="text-sm font-semibold tracking-tight">
            {book.name}
          </svelte:element>
        </div>
        <p class="relative z-10 mt-2 text-sm text-muted-foreground">
          {book.description}
        </p>
      </div>
  
      <div class="relative z-10 mt-auto pt-4 ml-1">
        {#if book.tags && book.tags.length > 0}
          <div class="flex flex-wrap gap-x-2 items-center">
            {#each book.tags as tag, index}
              <div class="flex items-center justify-center space-x-0.5 group">
                <HashIcon class="w-3 h-3 text-muted-foreground icon-scale" />
                <span class="text-xs text-muted-foreground tracking-tighter">
                  {tag}
                </span>
              </div>
            {/each}
          </div>
        {/if}
      </div>  
    </div>
    
      <a 
      href={`${base}/notes/${book.slug}`}
      rel="noopener noreferrer"
      class="absolute inset-0 z-20"
      aria-labelledby="book-title-{book.name.replace(/\s+/g, '-').toLowerCase()}"
      ></a>
  </li>