<script>
	import travelImage from "$lib/images/travel.jpg";
	import SocialLinks from "$lib/components/SocialLinks.svelte";
	import { aboutMeHeadline, aboutParagraphs } from "$lib/config/infoConfig";
    import Container from "$lib/components/container/Container.svelte";
    import AboutLinks from "$lib/components/AboutLinks.svelte";
</script>

<svelte:head>
	<title>About</title>
	<meta
		name="description"
		content="I'm Spencer Sharp. I live in New York City, where I design the future."
	/>
</svelte:head>

<Container className="mt-16 sm:mt-32">
	<div
		class="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12"
	>
		<div class="lg:pl-20">
			<div class="max-w-xs px-2.5 lg:max-w-none">
				<img
					src={travelImage}
					alt=""
					class="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
					sizes="(min-width: 1024px) 32rem, 20rem"
				/>
			</div>
		</div>
		<div class="lg:order-first lg:row-span-2">
			<h1
				class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
			>
				{aboutMeHeadline}
			</h1>
			<div class="mt-6 space-y-7 text-xl text-zinc-700 dark:text-zinc-300">
				{#each aboutParagraphs as paragraph, index}
					<p>{paragraph}</p>
				{/each}
			</div>
		</div>
		<div class="lg:pl-20">
			<AboutLinks />
		</div>
	</div>
</Container>
