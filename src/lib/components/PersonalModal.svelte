<script lang="ts">
	import type { worker } from '$lib/data';
	let { closeModal, chosenWorker }: { closeModal: () => void; chosenWorker: worker } = $props();
	import { X } from '@lucide/svelte';

	// Close modal when clicking outside
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	// Close modal with Escape key or Enter/Space on backdrop
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<div
	class="fixed top-0 left-0 z-40 flex h-full min-h-screen w-screen cursor-default items-center justify-center bg-black/60 p-6"
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
	role="button"
	tabindex="0"
>
	<div
		class="flex h-auto w-full flex-col items-start justify-start overflow-scroll border bg-[#F6F2E8] p-4 md:w-[40vw]"
	>
		<div class="mb-2 flex w-full items-center justify-start gap-2">
			<img
				src={chosenWorker.image}
				alt={chosenWorker.name}
				class="h-20 w-20 rounded-full border-2 border-[#F6F2E8] object-cover"
			/>
			<h2 class="text-4xl">
				{chosenWorker.name}
			</h2>
			<button
				class="ml-auto border px-2 py-1 duration-100 hover:border-r-2 hover:border-b-2"
				onclick={closeModal}><X size={20} /></button
			>
		</div>
		<div class="flex items-center justify-start gap-1">
			<h3 class="text-2xl">Goto beer:</h3>
			<p>{chosenWorker.goto}</p>
		</div>
		<div class="flex items-center justify-start gap-1">
			<h3 class="text-2xl">Period:</h3>
			<p>{chosenWorker.period}</p>
		</div>
		<div class="flex items-center justify-start gap-1">
			<h3 class="text-2xl">Fav burger:</h3>
			<p>{chosenWorker.burger}</p>
		</div>
		<div class="flex items-center justify-start gap-1">
			<h3 class="text-2xl">Hint:</h3>
			<p>{chosenWorker.hint}</p>
		</div>
		<div class="flex items-center justify-start gap-1">
			<h3 class="text-2xl">Bday:</h3>
			<p>{chosenWorker.bday}</p>
		</div>
	</div>
</div>
