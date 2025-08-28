<script lang="ts">
	import { CornerDownRight } from '@lucide/svelte';
	import { workers } from '$lib/data';
	import type { worker } from '$lib/data';
	import PlayModal from '$lib/components/PlayModal.svelte';
	import { goto } from '$app/navigation';
	import { getTodayStatus, markLoss, markWin, listGuessedNames } from '$lib/storage';
	import { createToaster } from '@skeletonlabs/skeleton-svelte';
	import { Toaster } from '@skeletonlabs/skeleton-svelte';

	const toaster = createToaster();

	// Function to pick a random worker from the workers list, excluding already-guessed names
	const pickRandomWorker = () => {
		const guessed = new Set(listGuessedNames());
		const pool = workers.filter((w) => !guessed.has(w.name));
		const source = pool.length > 0 ? pool : workers;
		const randomIndex = Math.floor(Math.random() * source.length);
		return source[randomIndex];
	};

	let currentGuess = $state('');
	let hasWon = $state(false);
	let hasLost = $state(false);
	let guesses: worker[] = $state([]);
	let randomWorker: worker = pickRandomWorker();
	let guessCount = $state(0);
	let modalGuessedWorker: worker | undefined = $state(undefined);

	// Create a computed value for reversed guesses
	let reversedGuesses = $derived([...guesses].reverse());

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleEnter();
		}
	}

	const handleEnter = () => {
		let found = workers.find((worker) => worker.name.toLowerCase() === currentGuess.toLowerCase());
		if (found && !guesses.includes(found)) {
			guesses.push(found);
			currentGuess = '';
			guessCount++;
			if (guessCount === 3 && hasWon === false) {
				hasLost = true;
				hasWon = false;
				guessCount = 0;
				markLoss();
			}
			if (
				found.burger === randomWorker.burger &&
				found.goto === randomWorker.goto &&
				found.period === randomWorker.period
			) {
				hasWon = true;
				hasLost = false;
				guessCount = 0;
				markWin(randomWorker.name);
			}
		} else {
			toaster.info({
				title: 'No such worker'
			});
		}
	};

	const closeModal = () => {
		hasLost = false;
		hasWon = false;
		document.body.style.overflow = 'auto';
		goto('/');
	};

	// Prevent page scrolling when modal is open
	$effect(() => {
		if (hasLost || hasWon) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	});

	// If game already played today, show modal immediately (win/loss)
	$effect(() => {
		const status = getTodayStatus();
		if (status.playedToday) {
			if (status.result === 'win') {
				hasWon = true;
				hasLost = false;
				modalGuessedWorker = workers.find((w) => w.name === status.guessedName);
			} else {
				hasLost = true;
				hasWon = false;
				modalGuessedWorker = undefined;
			}
		}
	});

	// Trying to prevent scroll on input focus
	const input = document.querySelector('input');
	input?.focus({ preventScroll: true });
</script>

<Toaster
	classes="bg-[#F6F2E8] border-black border rounded-none text-black border-b-3 border-r-3"
	{toaster}
></Toaster>

{#if hasLost}
	<PlayModal {closeModal} />
{/if}

{#if hasWon}
	<PlayModal {closeModal} {hasWon} guessedWorker={modalGuessedWorker ?? randomWorker} />
{/if}

<div
	class="flex h-auto min-h-screen w-screen flex-col items-center justify-center gap-4 bg-[#F6F2E8] p-4"
>
	<div class="flex h-[70vh] flex-col items-center justify-between gap-4 px-4 py-2 md:w-[60vw]">
		<h1 class="text-5xl md:text-6xl">Start Guessing!</h1>
		<div class="flex max-h-[70vh] w-full flex-col gap-2 overflow-scroll">
			{#each reversedGuesses as guess (guess.name)}
				<div
					class="flex h-auto w-full flex-col items-start justify-start gap-2 border border-r-2 border-b-2 px-4 py-2"
				>
					<div class="flex items-center justify-start gap-2">
						<img
							src={guess.image}
							alt={guess.name}
							class="h-20 w-20 rounded-full border-2 border-[#F6F2E8] object-cover"
						/>
						<h2 class="text-4xl">
							{guess.name}
						</h2>
					</div>
					<div class="grid w-full grid-cols-1 items-center justify-center gap-2 md:grid-cols-3">
						<div
							class={`flex flex-col items-center justify-center border border-r-3 border-b-3 border-black px-2 py-1 ${guess.goto === randomWorker.goto ? 'bg-[#357c4f] text-[#f6f2e8]' : 'bg-gray-400/70'}`}
						>
							<p class="text-sm">Goto beer</p>
							<h3 class="text-2xl">{guess.goto}</h3>
						</div>
						<div
							class={`flex flex-col items-center justify-center border border-r-3 border-b-3 border-black px-2 py-1 ${guess.period === randomWorker.period ? 'bg-[#357c4f] text-[#f6f2e8]' : 'bg-gray-400/70'}`}
						>
							<p class="text-sm">Time at Mikkeller</p>
							<h3 class="text-2xl">{guess.period}</h3>
						</div>
						<div
							class={`flex flex-col items-center justify-center border border-r-3 border-b-3 border-black px-2 py-1 ${guess.burger === randomWorker.burger ? 'bg-[#357c4f] text-[#f6f2e8]' : 'bg-gray-400/70'}`}
						>
							<p class="text-sm">Fav Burger</p>
							<h3 class="text-2xl">{guess.burger}</h3>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="w-full">
			<div class="justfy-center mt-4 flex w-full items-center gap-2">
				<input
					type="text"
					placeholder="nimi"
					bind:value={currentGuess}
					onkeydown={handleKeydown}
					class="h-10 w-full border border-r-3 border-b-3 px-2 py-1"
				/>
				<div class="justfy-start flex items-center gap-2">
					<button
						class="h-10 border border-r-3 border-b-3 px-2 py-1 duration-100"
						onclick={handleEnter}><CornerDownRight size={20} /></button
					>
					<p class="text-xl">{guessCount}/3</p>
				</div>
			</div>
			<div class="mt-2 flex w-full items-center justify-center gap-2">
				<h3 class="text-3xl">Hint:</h3>
				{#if guessCount < 2}
					<p>Hint will appear after 2 guesses</p>
				{:else}
					<p class="rounded-lg bg-[#357c4f] px-2 py-1 text-[#f6f2e8]">
						{randomWorker.hint}
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>
