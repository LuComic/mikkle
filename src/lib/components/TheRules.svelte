<script lang="ts">
	import { Beer } from '@lucide/svelte';
</script>

<div
	class="mb-auto flex h-full flex-1 flex-col items-start justify-start overflow-scroll pr-4 md:max-h-[60vh]"
>
	<h1 class="w-full pt-2 text-left text-4xl">The rules</h1>
	<ul class="mt-4 space-y-3 pb-2 font-semibold">
		<li class="flex items-start justify-start gap-2">
			<Beer class="flex-shrink-0" size={20} />
			<span>You have 3 guesses</span>
		</li>
		<li class="flex items-start justify-start gap-2">
			<Beer class="flex-shrink-0" size={20} />
			<span>1 every day, though you can reset the stats if you want</span>
		</li>
		<li class="flex items-start justify-start gap-2">
			<Beer class="flex-shrink-0" size={20} />
			<span>Names that have already been guessed won't come again</span>
		</li>
		<li class="flex items-start justify-start gap-2">
			<Beer class="flex-shrink-0" size={20} />
			<span>Just right (green) or wrong (gray), no 'close'</span>
		</li>
		<li class="flex items-start justify-start gap-2">
			<Beer class="flex-shrink-0" size={20} />
			<span>Other - not Burst or Tokyo</span>
		</li>
		<li class="flex items-start justify-start gap-2">
			<Beer class="flex-shrink-0" size={20} />
			<span>After 2 guesses you get a hint</span>
		</li>
		<li class="flex items-start justify-start gap-2">
			<Beer class="flex-shrink-0" size={20} />
			<span>The daily worker can be different for everyone!</span>
		</li>
	</ul>
</div>
