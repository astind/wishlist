<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { fly, slide } from 'svelte/transition';

  let {data, form} = $props();

  let newOpen = $state(false);
  
  function openNew() {
    newOpen = true;
  }

  function cancelNew() {
    newOpen = false;
    if (form) {
      form.message = null;
    }
  }
</script>


<div class="flex flex-col">
  <h1>Welcome, {data.user.username}</h1>


  <div class="flex justify-center">
    <h2>Your Wishlists:</h2>
  </div>

  <div class="flex justify-end">
    <button class="btn btn-primary" onclick={openNew}>New Wishlist</button>
  </div>

  {#if newOpen}
  	<div in:slide out:slide class="flex justify-center">
  	  <form action="?/new" method="post" use:enhance={() => {
  	      return async ({update}) => {
  	        await update();
  	          
  	        newOpen = false;
  	      }
  	    }}>
  	    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend class="fieldset-legend">New Wishlist</legend>
  
            <label class="label" for="name">Name</label>
            <input type="text" class="input" placeholder="Name" name="name" id="name" required/>
  
            <label class="label" for="description">Description</label>
            <textarea class="textarea" placeholder="Description" id="description" name="description"></textarea>
  
            <label class="label mt-2">
              <input type="checkbox" class="checkbox" name="private"/>
              Private
            </label>
            <div class="flex justify-end space-x-4">
              <button class="btn btn-primary">Save</button>
              <button class="btn btn-error" onclick={cancelNew}>Cancel</button>
            </div>
            {#if form?.message}
              <p class="mt-4">{form.message}</p>
            {/if}
        </fieldset>
  	  </form>
  	</div>
  {/if}

  <ul class="list bg-base-100 rounded-box shadow-md mt-8">
    {#each data.wishlists as list}
    	<li class="list-row" in:fly={{y: 20}} out:slide>
        <div></div>
        <div>
          <div>{list.name}</div>
          <div class="text-xs font-semibold opacity-60">{list.description}</div>
        </div>
        <a class="btn btn-square btn-ghost" aria-label="Edit Wishlist" href="/wishlist/{list.id}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </a>
        <button class="btn btn-square btn-ghost" aria-label="Delete Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          
        </button>
      </li>
    {/each}          
  </ul>
  
  <div class="flex justify-end mt-8">
    <form action="?/logout" method="post" use:enhance>
      <button class="btn btn-secondary">Logout</button>
    </form>
  </div>
</div>
