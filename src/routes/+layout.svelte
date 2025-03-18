<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/client/components/navbar.svelte';
	import Dock from '$lib/client/components/dock.svelte';

	let { children } = $props();
</script>


<div class="flex justify-center mt-8">
	<div class="flex flex-col w-full max-w-4xl">

		<Navbar></Navbar>
	
		<div class="bg-base-200 mt-8 min-h-dvh rounded-2xl p-4">
			{@render children()}
		</div>

		<Dock></Dock>
	</div>
</div>


