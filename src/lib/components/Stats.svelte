<script lang="ts">
	import { workers } from '$lib/data';
	import type { worker } from '$lib/data';
	import PersonalModal from './PersonalModal.svelte';
	import { Lock } from '@lucide/svelte';
	import { listGuessedNames, getTodayStatus } from '$lib/storage';

	let modalOpen = $state(false);
	let chosenWorker: worker = $state({
		name: 'default',
		goto: 'burst',
		burger: 'Cheeseburger',
		hint: 'default',
		period: 'old',
		image: 'default'
	});

	let guessedSet = $state<Set<string>>(new Set(listGuessedNames()));

	function refreshGuessed() {
		guessedSet = new Set(listGuessedNames());
	}

	function checkCheatCookie(): boolean {
		if (typeof document === 'undefined') return false;
		return document.cookie.split('; ').some((c) => c.trim().startsWith('mikkle_cheat='));
	}

	let cheatActive = $state(checkCheatCookie());

	function computeOrderedWorkers(): worker[] {
		const status = getTodayStatus();
		if (!status.playedToday || !status.guessedName) return workers as worker[];
		const today = workers.find((w) => w.name === status.guessedName);
		if (!today) return workers as worker[];
		const rest = workers.filter((w) => w.name !== today.name);
		return [today, ...rest] as worker[];
	}

	let orderedWorkers = $derived(computeOrderedWorkers());

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

	// Keep guessed list in sync (initial load + cross-tab updates + cheat cookie changes)
	$effect(() => {
		const sync = () => {
			cheatActive = checkCheatCookie();
			if (cheatActive) {
				guessedSet = new Set(workers.map((w) => w.name));
			} else {
				refreshGuessed();
			}
		};
		sync();
		const storageHandler = (e: StorageEvent) => {
			if (e.key === 'mikkle_guessed_names') sync();
		};
		const cheatHandler = () => sync();
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', storageHandler);
			window.addEventListener('mikkle-cheat-changed', cheatHandler as EventListener);
			window.addEventListener('focus', cheatHandler);
		}
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('storage', storageHandler);
				window.removeEventListener('mikkle-cheat-changed', cheatHandler as EventListener);
				window.removeEventListener('focus', cheatHandler);
			}
		};
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
	<ul class="mt-4 w-full space-y-1 pb-4 font-semibold">
		{#each orderedWorkers as worker (worker.name)}
			<li class="relative">
				{#if !guessedSet.has(worker.name)}
					<div
						class="absolute top-0 left-0 flex h-full w-full items-center justify-center border border-r-2 border-b-2 bg-gray-400/40"
					>
						<Lock />
					</div>
				{/if}
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
					</div>
				</button>
			</li>
		{/each}
	</ul>
</div>
