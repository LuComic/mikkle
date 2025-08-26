<script lang="ts">
	import { workers } from '$lib/data';
	import type { worker } from '$lib/data';
	import PersonalModal from './PersonalModal.svelte';

	let modalOpen = $state(false);
	let chosenWorker: worker = $state({
		name: 'default',
		goto: 'burst',
		hint: 'default',
		period: 'old',
		image: 'default'
	});

	const closeModal = () => {
		modalOpen = false;
		document.body.style.overflow = 'auto';
	};

	// Prevent page scrolling when modal is open
	$effect(() => {
		if (modalOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	});
</script>

{#if modalOpen}
	<PersonalModal {closeModal} {chosenWorker} />
{/if}

<div
	class="mb-auto flex h-full flex-1 flex-col items-start justify-start border-b md:border-b-0 md:border-l md:pl-4"
>
	<h1 class="w-full pt-2 text-left text-4xl">Possible guesses</h1>
	<p>Collect them all!</p>
	<ul class="mt-4 w-full pb-4 font-semibold">
		{#each workers as worker (worker.name)}
			<li>
				<button
					class="flex w-full items-center justify-start gap-2 border border-r-2 border-b-2 border-[#F6F2E8] px-2 py-1 duration-100 hover:border-black"
					onclick={() => {
						chosenWorker = worker;
						modalOpen = true;
					}}
				>
					<img
						src={worker.image}
						alt={worker.name}
						class="h-10 w-10 rounded-full border-2 border-[#F6F2E8] object-cover"
					/>
					<div class="flex w-full items-center justify-between">
						{worker.name}
						<p>(not guessed)</p>
					</div>
				</button>
			</li>
		{/each}
	</ul>
</div>
