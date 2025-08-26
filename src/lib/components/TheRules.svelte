<script lang="ts">
	import { Beer } from '@lucide/svelte';
</script>

<div class="mb-auto flex h-full flex-1 flex-col items-start justify-start pr-4">
	<h1 class="w-full pt-2 text-left text-4xl">The rules</h1>
	<ul class="mt-4 space-y-3 pb-2 font-semibold">
		<li class="flex items-center justify-start gap-2">
			<Beer />
			You have 3 guesses
		</li>
		<li class="flex items-center justify-start gap-2">
			<Beer />
			1 every day, though you can reset the stats if you want
		</li>
		<li class="flex items-center justify-start gap-2">
			<Beer />
			Names that have already been guessed won't come again
		</li>
		<li class="flex items-center justify-start gap-2">
			<Beer />
			Just right (green) or wrong (gray), no 'close'
		</li>
	</ul>
</div>
