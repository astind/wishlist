<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();
</script>

<div class="flex flex-col">

	<div class="flex justify-end">
		<form action="?/logout" method="post" use:enhance>
			<button class="btn btn-square" aria-label="logout">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
				</svg>
			</button>
		</form>	
	</div>
	
	<div class="flex items-center justify-center">
		<h1 class="text-2xl font-semibold">Welcome, {data.user.username}</h1>
	</div>
	
	<h2 class="text-xl font-semibold mt-8">Your Recent Lists:</h2>
	
	<ul class="list bg-base-100 rounded-box shadow-md mt-4">
		{#each data.lists as list}
			<li class="list-row">
				<div></div>
				<div class="flex flex-col justify-center">
					<div class="text-lg">{list.name}</div>
					{#if list.description}
						<div class="text-sm font-semibold opacity-60">{list.description}</div>
					{/if}
				</div>
				<a class="btn btn-square btn-ghost" aria-label="Edit list" href="/lists/{list.name}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
				</a>
			</li>
		{/each}
	</ul>

	<div class="flex justify-end mt-4">
		<a class="btn btn-primary" href="/lists">Go to lists</a>
	</div>

	<h2 class="text-xl font-semibold mt-8">My Groups:</h2>

	<div class="flex justify-end mt-4">
		<a class="btn btn-primary" href="/groups">Go to groups</a>
	</div>
	
</div>
