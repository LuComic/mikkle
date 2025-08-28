<script lang="ts">
	import TheRules from '$lib/components/TheRules.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import { HeartCrack, Hourglass, PartyPopper } from '@lucide/svelte';
	import { getTodayStatus, clearTodayIfExpired, formatMs } from '$lib/storage';

	let playedToday = $state(false);
	let result: 'win' | 'loss' | undefined = $state(undefined);
	let guessedName: string | undefined = $state(undefined);
	let resetAt = $state<number | undefined>(undefined);
	let countdown = $state('');

	function refreshStatus() {
		const status = getTodayStatus();
		playedToday = status.playedToday;
		result = status.result;
		guessedName = status.guessedName;
		resetAt = status.resetAt;
		if (resetAt) {
			countdown = formatMs(resetAt - Date.now());
		} else {
			countdown = '';
		}
	}

	let intervalId: number | undefined = undefined;

	$effect(() => {
		refreshStatus();
		if (intervalId) {
			clearInterval(intervalId);
		}
		intervalId = setInterval(() => {
			const expired = clearTodayIfExpired();
			if (expired) {
				refreshStatus();
				return;
			}
			if (resetAt) {
				const ms = resetAt - Date.now();
				countdown = formatMs(ms);
			}
		}, 1000) as unknown as number;
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});

	// Listen for reset events from the Stats component
	$effect(() => {
		const handleReset = () => {
			refreshStatus();
		};
		if (typeof window !== 'undefined') {
			window.addEventListener('mikkle-reset', handleReset);
		}
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('mikkle-reset', handleReset);
			}
		};
	});
</script>

<div
	class="flex h-auto md:pt-20 min-h-screen w-screen flex-col items-center justify-center gap-4 bg-[#F6F2E8] p-4"
>
	<div
		class="grid h-full grid-cols-1 items-center justify-center border border-r-4 border-b-4 px-4 shadow-lg md:max-w-[80vw] md:grid-cols-2"
	>
		<TheRules />
		<Stats />
	</div>
	{#if !playedToday}
		<button
			class="mt-0.5 border px-2 py-1 duration-100 hover:mt-0 hover:border-r-3 hover:border-b-3"
		>
			<a class="text-3xl visited:text-black md:text-4xl" href="/play">Play</a>
		</button>
	{:else}
		<div class="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
			<h3 class="flex items-start justify-start gap-2 text-2xl">
				{#if result === 'win'}
					<PartyPopper size={20} />
					Today's worker was {guessedName}
				{:else}
					<HeartCrack size={20} />
					You didn't guess the worker today
				{/if}
			</h3>
			<h3 class="flex items-center justify-start gap-2 text-2xl">
				<Hourglass size={20} />
				Guess again in: {countdown}
			</h3>
		</div>
	{/if}
</div>
