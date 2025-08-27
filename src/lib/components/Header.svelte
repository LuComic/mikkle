<script lang="ts">
	let buffer = '';
	const SECRET = 'mikkle'; // type this anywhere to toggle cheat

	function setCheatCookie(enabled: boolean) {
		const expires = enabled
			? new Date(Date.now() + 365 * 24 * 3600 * 1000).toUTCString()
			: new Date(0).toUTCString();
		if (enabled) {
			document.cookie = `mikkle_cheat=1; expires=${expires}; path=/`;
		} else {
			document.cookie = `mikkle_cheat=; expires=${expires}; path=/`;
		}
	}

	function hasCheatCookie(): boolean {
		return document.cookie.split('; ').some((c) => c.trim().startsWith('mikkle_cheat='));
	}

	function toggleCheat() {
		const next = !hasCheatCookie();
		setCheatCookie(next);
		window.dispatchEvent(new Event('mikkle-cheat-changed'));
	}

	function onKeydown(e: KeyboardEvent) {
		const ch = e.key.toLowerCase();
		if (ch.length !== 1 || !/[a-z]/.test(ch)) return;
		buffer = (buffer + ch).slice(-SECRET.length);
		if (buffer === SECRET) {
			buffer = '';
			toggleCheat();
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});
</script>

<a
	class="fixed top-2 left-1/2 z-30 mx-auto flex w-auto -translate-x-1/2 transform items-center justify-center gap-4 border border-r-4 border-b-4 bg-[#f6f2e8] px-4 py-4 shadow-lg visited:text-black md:top-5"
	href="/"
>
	<h3 class="text-2xl">Mikk'le</h3>
	<span class="vr hidden h-6 md:flex"></span>
	<h3 class="hidden text-2xl md:flex">Mikkeller team's "guess who"</h3>
</a>
