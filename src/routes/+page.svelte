<script lang="ts">
	import TheRules from '$lib/components/TheRules.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import { HeartCrack, Hourglass, PartyPopper } from '@lucide/svelte';
	import {
		getTodayStatus,
		clearTodayIfExpired,
		formatMs,
		getActiveProfile,
		setActiveProfile
	} from '$lib/storage';

	let playedToday = $state(false);
	let result: 'win' | 'loss' | undefined = $state(undefined);
	let guessedName: string | undefined = $state(undefined);
	let resetAt = $state<number | undefined>(undefined);
	let countdown = $state('');
	let activeProfile = $state('Default');

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
		activeProfile = getActiveProfile();
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

	function selectProfile(name: string) {
		setActiveProfile(name);
		activeProfile = name;
	}

	// Keep active profile in sync across tabs
	$effect(() => {
		const handler = (e: CustomEvent) => {
			if (e?.detail?.profile) activeProfile = e.detail.profile;
		};
		if (typeof window !== 'undefined') {
			window.addEventListener('mikkle-profile-changed', handler as EventListener);
		}
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('mikkle-profile-changed', handler as EventListener);
			}
		};
	});
</script>

<div
	class="flex h-auto min-h-screen w-screen flex-col items-center justify-center gap-4 bg-[#F6F2E8] p-4 md:pt-20"
>
	<div class="flex items-center justify-center gap-6 md:max-w-[80vw]">
		<button
			class={`px-2 py-1 ${activeProfile === 'Default' ? 'border border-r-2 border-b-2 border-black bg-black text-[#F6F2E8]' : 'border hover:border-r-2 hover:border-b-2'}`}
			onclick={() => selectProfile('Default')}
		>
			Default
		</button>
		<button
			class={`px-2 py-1 ${activeProfile === 'Jakob' ? 'border border-r-2 border-b-2 border-black bg-black text-[#F6F2E8]' : 'border hover:border-r-2 hover:border-b-2'}`}
			onclick={() => selectProfile('Jakob')}
		>
			Jakob
		</button>
		<button
			class={`px-2 py-1 ${activeProfile === 'Mona' ? 'border border-r-2 border-b-2 border-black bg-black text-[#F6F2E8]' : 'border hover:border-r-2 hover:border-b-2'}`}
			onclick={() => selectProfile('Mona')}
		>
			Mona
		</button>
		<button
			class={`px-2 py-1 ${activeProfile === 'Grethe' ? 'border border-r-2 border-b-2 border-black bg-black text-[#F6F2E8]' : 'border hover:border-r-2 hover:border-b-2'}`}
			onclick={() => selectProfile('Grethe')}
		>
			Grethe
		</button>
		<button
			class={`px-2 py-1 ${activeProfile === 'Iris' ? 'border border-r-2 border-b-2 border-black bg-black text-[#F6F2E8]' : 'border hover:border-r-2 hover:border-b-2'}`}
			onclick={() => selectProfile('Iris')}
		>
			Iris
		</button>
		<button
			class={`px-2 py-1 ${activeProfile === 'Tom' ? 'border border-r-2 border-b-2 border-black bg-black text-[#F6F2E8]' : 'border hover:border-r-2 hover:border-b-2'}`}
			onclick={() => selectProfile('Tom')}
		>
			Tom
		</button>
		<button
			class={`px-2 py-1 ${activeProfile === 'Puju' ? 'border border-r-2 border-b-2 border-black bg-black text-[#F6F2E8]' : 'border hover:border-r-2 hover:border-b-2'}`}
			onclick={() => selectProfile('Puju')}
		>
			Puju
		</button>
		<button
			class={`px-2 py-1 ${activeProfile === 'Liisa Lotta' ? 'border border-r-2 border-b-2 border-black bg-black text-[#F6F2E8]' : 'border hover:border-r-2 hover:border-b-2'}`}
			onclick={() => selectProfile('Liisa Lotta')}
		>
			Liisa Lotta
		</button>
	</div>
	<div
		class="grid h-full grid-cols-1 items-center justify-center border border-r-2 border-b-2 pl-4 shadow-lg md:max-w-[80vw] md:grid-cols-2"
	>
		<TheRules />
		<Stats />
	</div>
	{#if !playedToday}
		<button class="border px-2 py-1 duration-100 hover:mt-0 hover:border-r-2 hover:border-b-2">
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
