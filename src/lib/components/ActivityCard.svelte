<script>
    import { Calendar, Clock, MapPin } from 'lucide-svelte';
    
    // Define props
    export let activity;
    export let titleAs = 'h2';
    
    // Dynamic component
    $: Component = titleAs;
  </script>
  
  <li class="group relative flex flex-col items-start h-full">
    <div class="relative flex flex-col justify-between h-full w-full py-5 px-6 rounded-2xl border border-muted-foreground/20 shadow-sm transition-all group-hover:scale-[1.03] group-hover:shadow-md group-hover:bg-muted/5">
      <div>
        <div class="flex flex-col sm:flex-row justify-center sm:justify-start items-start sm:items-center gap-2">
          <Calendar size={20} />
          <svelte:element this={Component} class="text-sm font-semibold tracking-tight">
            {activity.name}
          </svelte:element>
        </div>
        <p class="relative z-10 mt-2 text-sm text-muted-foreground">
          {activity.description}
        </p>
      </div>
  
      <div class="relative z-10 mt-auto pt-4">
        <div class="flex flex-row items-center gap-4 text-xs font-semibold opacity-80">
          <div class="flex items-center gap-1">
            <Clock size={16} /> 
            {activity.date}
          </div>
          <div class="flex items-center gap-1">
            <MapPin size={16} /> 
            {activity.location}
          </div>
        </div>
      </div>
    </div>
    
    {#if activity.link}
        <a 
        href={activity.link}
        target="_blank"
        rel="noopener noreferrer"
        class="absolute inset-0 z-20"
        aria-labelledby="activity-title-{activity.name.replace(/\s+/g, '-').toLowerCase()}"
        ></a>
    {/if}
  </li>