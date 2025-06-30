<script lang="ts">
	import { enhance } from '$app/forms';
	import { fly, slide } from 'svelte/transition';

	let { data, form } = $props();

	let addNew = $state(false);
	let editIndex = $state(-1);
	let deleteIndex = $state(-1);

	function addNewItem() {
		addNew = true;
	}

	function cancelNewItem() {
		addNew = false;
		if (form) {
			form.message = '';
		}
	}
</script>

<div>
	<h1 class="flex justify-center text-2xl font-semibold">{data.list.name}</h1>
	<div class="flex justify-end">
		<button class="btn btn-primary" onclick={addNewItem}>Add</button>
	</div>

	{#if addNew}
		<div in:slide out:slide class="flex justify-center">
			<form
				action="?/newItem"
				method="post"
				use:enhance={() => {
					return async ({ update, result }) => {
						await update();
						if (result.type === 'success') {
							addNew = false;
						}
					};
				}}
			>
				<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-md border p-4">
					<legend class="fieldset-legend">New List Item</legend>
					<label class="label" for="name">Name*</label>
					<input
						class="input w-full"
						type="text"
						id="name"
						name="name"
						placeholder="Name"
						required
					/>
					<label class="label" for="link">URL/Link</label>
					<input class="input w-full" type="text" id="link" name="link" placeholder="Link" />
					<label for="description" class="label">Description</label>
					<textarea
						class="textarea w-full"
						placeholder="Description"
						id="description"
						name="description"
					></textarea>
					<label for="price" class="label">Price</label>
					<div class="input w-full">
						$
						<input type="number" class="grow" placeholder="Price" name="price" step="0.01" />
					</div>
					<label class="label mt-2">
						<input type="checkbox" class="checkbox" name="autoDelete" />
						Auto Delete Item if bought
					</label>
					<div class="flex justify-end space-x-4 mt-2">
						<button class="btn btn-accent" type="submit">Save</button>
						<button class="btn btn-error" type="button" onclick={cancelNewItem}>Cancel</button>
					</div>
					{#if form?.message}
						<p class="mt-4 text-error">
							{form.message}
						</p>
					{/if}
				</fieldset>
			</form>
		</div>
	{/if}

	<div class="flex mt-4">
		<h2 class="text-xl font-semibold">Items:</h2>
	</div>

	<ul class="list bg-base-100 rounded-box shadow-md mt-4">
		{#each data.list.items as item}
			<li class="list-row" in:fly={{ y: 20 }} out:slide>
				<div>
					{#if item.iconLink}
						<img src={item.iconLink} alt="wishlist item" />
					{/if}
				</div>
				<div class="flex flex-col justify-center">
					<div class="text-lg">{item.name}</div>

					{#if item.url}
						<div class="text-sm">
							<a class="link" href={item.url}>{item.url}</a>
						</div>
					{/if}
				</div>

				{#if item.description}
					<p class="list-col-wrap">{item.description}</p>
				{/if}
				<div class="flex items-center text-xl">
					${item.price}
				</div>
				<button aria-label="Edit Item" class="btn btn-square btn-ghost">
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
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
						/>
					</svg>
				</button>
				<button aria-label="Delete Item" class="btn btn-square btn-ghost">
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
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</button>
			</li>
		{/each}
	</ul>
</div>
