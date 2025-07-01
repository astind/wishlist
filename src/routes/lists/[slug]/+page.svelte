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

	function openEditItem(index: number) {
		if (deleteIndex >= 0) {
			deleteIndex = -1;
		}
		editIndex = index;
	}

	function openDeleteItem(index: number) {
		if (editIndex >= 0) {
			editIndex = -1
		}
		deleteIndex = index;
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
					<input type="hidden" name="wishlistId" value={data.list.id}>
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
		{#each data.list.items as item, index}
			<li class="list-row" in:fly={{ y: 20 }} out:slide>
				<div>
					{#if item.iconLink}
						<img src={item.iconLink} alt="wishlist item" />
					{/if}
				</div>
				<div class="flex flex-col justify-center">
					<div class="text-lg">{item.name}</div>

					{#if item.url}
						<div class="text-sm truncate text-ellipsis w-80">
							<a rel="external" class="link" href={item.url} target="_blank">{item.url}</a>
						</div>
					{/if}
				</div>
				<div class="list-col-wrap">
					{#if item.description}
						<p>{item.description}</p>
          {/if}
					{#if deleteIndex === index}
            <form class="mt-2 flex items-center" in:slide out:slide action="?/deleteItem" method="post" use:enhance={() => {
            	return async ({update, result}) => {
            		if (result.type === 'success') {
            			deleteIndex = -1;
            		}
            		await update();
            	}
            }}>
            	<div>
            		<input type="hidden" name="name" value={item.name}/>
            		<input type="hidden" name="wishlistId" value={data.list.id}/>	
            		Are you sure you want to delete this item?
            	</div>
            	<div class="ml-4">
            		<button type="button" class="btn btn-accent" onclick={() => deleteIndex = -1}>Cancel</button>
            		<button type="submit" class="btn btn-error">Delete</button>
            	</div>
            </form>
          {/if}
          {#if editIndex === index}
          	<form action="?/editItem" method="post" in:slide out:slide use:enhance={() => {
          		return async ({result, update}) => {
          			if (result.type === 'success') {
          				editIndex = -1;
          			}
          			await update();
          		}
          	}}>
          		<fieldset class="flex flex-col mx-auto fieldset bg-base-200 border-base-300 rounded-box w-md border p-4">
								<legend class="fieldset-legend">Edit Item</legend>
								<input type="hidden" name="wishlistId" value={data.list.id}/>
								<input type="hidden" name="ogName" value={item.name}/>
								<label class="label" for="name">Name*</label>
								<input
									class="input w-full"
									type="text"
									id="name"
									name="name"
									placeholder="Name"
									value={item.name}
									required
								/>
								<label class="label" for="link">URL/Link</label>
								<input class="input w-full" type="text" id="link" name="link" placeholder="Link" value={item.url} />
								<label for="description" class="label">Description</label>
								<textarea
									class="textarea w-full"
									placeholder="Description"
									id="description"
									name="description"
									value={item.description}
								></textarea>
								<label for="price" class="label">Price</label>
								<div class="input w-full">
									$
									<input type="number" class="grow" placeholder="Price" name="price" step="0.01" value={item.price}/>
								</div>
								<label class="label mt-2">
									<input type="checkbox" class="checkbox" name="autoDelete" checked={item.autoDelete}/>
									Auto Delete Item if bought
								</label>
								<div class="flex justify-end space-x-4 mt-2">
									<button class="btn btn-accent" type="submit">Save</button>
									<button class="btn btn-error" type="button" onclick={() => editIndex = -1}>Cancel</button>
								</div>
								{#if form?.message}
									<p class="mt-4 text-error">
										{form.message}
									</p>
								{/if}
							</fieldset>
          	</form>
          {/if}		
        </div>
				<div class="flex items-center text-xl">
					{#if item.price}
          	${item.price}
          {/if}
				</div>
				<button aria-label="Edit Item" onclick={() => openEditItem(index)} class="btn btn-square btn-ghost">
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
				<button aria-label="Delete Item" onclick={() => openDeleteItem(index)} class="btn btn-square btn-ghost">
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
