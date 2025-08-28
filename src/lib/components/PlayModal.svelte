<script lang="ts">
	import type { worker } from '$lib/data';
	let {
		closeModal,
		guessedWorker,
		hasWon
	}: { closeModal: () => void; guessedWorker?: worker; hasWon?: boolean } = $props();
	import { X, HeartCrack, PartyPopper, SignalZero } from '@lucide/svelte';
	import { Confetti } from 'svelte-confetti';

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
		style="
position: fixed;
top: -50px;
left: 0;
height: 100vh;
width: 100vw;
display: flex;
justify-content: center;
overflow: hidden;
pointer-events: none;"
	>
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[0, 2000]}
			infinite
			duration={5000}
			amount={400}
			size={10}
			fallDistance="100vh"
		/>
	</div>
	<div
		class="flex h-auto w-full flex-col items-start justify-start overflow-scroll border border-r-4 border-b-4 bg-[#F6F2E8] p-4 md:w-[40vw]"
	>
		<div class="flex w-full items-center justify-between">
			<h2 class="flex items-center justify-start gap-2 text-4xl">
				{#if hasWon}
					<PartyPopper size={24} />
					You Won!
				{:else}
					<HeartCrack size={24} />
					You Lost!
				{/if}
			</h2>
			<button
				class="ml-auto border px-2 py-1 duration-100 hover:border-r-2 hover:border-b-2"
				onclick={closeModal}><X size={20} /></button
			>
		</div>
		{#if !hasWon}
			<p>Can't tell you who it was or it'll be too easy next time</p>
		{/if}
		{#if hasWon}
			<div class="mb-2 flex w-full items-center justify-start gap-2">
				<img
					src={guessedWorker?.image}
					alt={guessedWorker?.name}
					class="h-20 w-20 rounded-full border-2 border-[#F6F2E8] object-cover"
				/>
				<h2 class="text-4xl">
					{guessedWorker?.name}
				</h2>
			</div>
			<div class="flex items-center justify-start gap-1">
				<h3 class="text-2xl">Goto beer:</h3>
				<p>{guessedWorker?.goto}</p>
			</div>
			<div class="flex items-center justify-start gap-1">
				<h3 class="text-2xl">Period:</h3>
				<p>{guessedWorker?.period}</p>
			</div>
			<div class="flex items-center justify-start gap-1">
				<h3 class="text-2xl">Fav burger:</h3>
				<p>{guessedWorker?.burger}</p>
			</div>
			<div class="flex items-center justify-start gap-1">
				<h3 class="text-2xl">Hint:</h3>
				<p>{guessedWorker?.hint}</p>
			</div>
		{/if}
	</div>
</div>
