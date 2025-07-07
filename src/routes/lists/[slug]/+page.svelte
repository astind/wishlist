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

	function openSettings() {
		const modal = document.getElementById('list-settings-modal');
		if (modal) {
			modal.showModal();
		}
	}

	function closeSettings() {
		const modal = document.getElementById('list-settings-modal');
		if (modal) {
			modal.close();
		}
		const radio = document.getElementById('list-settings-radio');
		if (radio) {
			radio.checked = true;
		}
	}
</script>

<div>
	
	<div class="flex justify-between md:justify-end space-x-4">
		<div class="space-x-4">
			<button class="btn btn-square" type="button" aria-label="Settings" title="Settings" onclick={openSettings}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  				<path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
  				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
				</svg>
			</button>
			{#if !data.list.private}
    		<button class="btn btn-square" type="button" aria-label="Share" title="Share">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  					<path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
					</svg>
				</button>
    	{/if}
		</div>
		
		<button class="btn btn-primary" onclick={addNewItem}>Add Item</button>
	</div>

	<dialog id="list-settings-modal" class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">{data.list.name} Settings:</h3>
			<input type="radio" name="list-settings" hidden id="list-settings-radio" checked>
			<div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
				<input type="radio" name="list-settings"/>
 				<div class="collapse-title font-semibold">List Details</div>
			 	<div class="collapse-content">
			 		<form action="?/updateList" method="post" use:enhance>
			 			<fieldset class="fieldset w-full px-4">
  						<label class="label" for="name">Name:</label>
  						<input type="text" id="name" class="input w-full" placeholder="Name" name="name" value={data.list.name} />

  						<label class="label" for="description">Description</label>
  						<input type="text" class="input w-full" id="description" name="description" value={data.list.description} placeholder="Description" />

  						<label class="label mt-2">
								<input type="checkbox" class="checkbox" name="private" checked={data.list.private} />
								Private
							</label>
							<p class="label">Private lists cannot be found with a link.</p>
							<div class="flex justify-end space-x-4">
								<button type="submit" class="btn btn-info">Save</button>
							</div>
						</fieldset>
			 		</form>
  			</div>
			</div>
			<div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
				<input type="radio" name="list-settings"/>
				<div class="collapse-title font-semibold">List Groups</div>
				<div class="collapse-content">
					{#if data.list.groups.length}
						
					{:else}
          	List has not been shared to any groups
          {/if}
				</div>
			</div>

			<div class="collapse collapse-arrow bg-base-200 border-base-300 border mt-4">
				<input type="radio" name="list-settings"/>
				<div class="collapse-title font-semibold">Shared Users:</div>
				<div class="collapse-content">
					{#if data.list.shared.length}
						
					{:else}
          	List has not been shared with any users
          {/if}
				</div>
			</div>
			
			<div class="modal-action">
				<button class="btn" type="button" onclick={closeSettings}>Close</button>
			</div>
		</div>
	</dialog>

	<div class="flex flex-col items-center space-y-2">
		<h1 class="text-2xl mt-4 lg:mt-0 font-semibold">{data.list.name}</h1>
		<p >{data.list.description}</p>
	</div>
	
	{#if addNew}
		<div in:slide out:slide class="flex justify-center mt-4">
			<form class="w-full"
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
				<fieldset class="flex flex-col mx-auto fieldset bg-base-200 border-base-300 rounded-box max-w-md border p-4">
					<legend class="fieldset-legend">New List Item</legend>
					<input type="hidden" name="listId" value={data.list.id}>
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
						<button class="btn btn-info" type="submit">Save</button>
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

	<ul class="bg-base-100 rounded-box shadow-md mt-4 p-5">
		{#each data.list.items as item, index}
			<li class="grid grid-cols-6 gap-y-2 gap-x-1 py-5 first:pt-0 last:pb-0 last:border-b-0 border-b border-base-200" in:fly={{ y: 20 }} out:slide>
				{#if item.iconLink}
					<div class="col-span-1">
						<img src={item.iconLink} alt="list item" />
					</div>
					<div class="col-span-6 md:col-span-4">
						{item.name}
					</div>
				{:else}
					<div class="col-span-6 md:col-span-5">
						<div class="flex justify-between text-xl">
							<div class="font-semibold">
								{item.name}
							</div>
							{#if item.price} 
								<div class="text-xl md:hidden"> 
									${item.price} 
								</div> 
							{/if}
						</div>
						{#if item.url}
							<div class="text-sm truncate text-ellipsis mt-2">
								<a rel="external" class="link" href={item.url} target="_blank">{item.url}</a>
							</div>
						{/if}
												
						{#if item.description}
							<div class="mt-2">
								{item.description}
							</div>
          	{/if}
					</div>
				{/if}
				<div class="col-span-6 md:col-span-1">
					<div class="flex space-x-2 items-center justify-end">
						<div class="hidden md:block text-xl">
							${item.price}
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
					</div>
        </div>
        	
				<div class="col-span-6">
					{#if deleteIndex === index} 
							<form class="mt-2 flex flex-col md:flex-row items-center" in:slide out:slide action="?/deleteItem" method="post" use:enhance={() => {
            		return async ({update, result}) => {
            			if (result.type === 'success') {
            				deleteIndex = -1;
            			}
            			await update();
            		}
            	}}>
            		<div>
            			<input type="hidden" name="name" value={item.name}/>
            			<input type="hidden" name="listId" value={data.list.id}/>	
            			Are you sure you want to delete this item?
            		</div>
            		<div class="md:ml-4 mt-4 md:mt-0 flex justify-end space-x-2">
            			<button type="button" class="btn btn-info" onclick={() => deleteIndex = -1}>Cancel</button>
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
          			<fieldset class="flex flex-col mx-auto fieldset bg-base-200 border-base-300 rounded-box max-w-md border p-4">
									<legend class="fieldset-legend">Edit Item</legend>
									<input type="hidden" name="listId" value={data.list.id}/>
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
										<button class="btn btn-info" type="submit">Save</button>
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
			</li>
		{/each}
	</ul>
</div>
