<script lang="ts">
	import TheRules from '$lib/components/TheRules.svelte';
	import Stats from '$lib/components/Stats.svelte';
</script>

<div
	class="flex h-auto min-h-screen w-screen flex-col items-center justify-center gap-4 bg-[#F6F2E8] p-4"
>
	<div
		class="grid h-full grid-cols-1 items-center justify-center border border-r-4 border-b-4 px-4 shadow-lg md:max-w-[80vw] md:grid-cols-2"
	>
		<TheRules />
		<Stats />
	</div>
	<button class="mt-0.5 border px-2 py-1 duration-100 hover:mt-0 hover:border-r-3 hover:border-b-3">
		<a class="text-4xl visited:text-black" href="/game">Play</a>
	</button>
</div>
