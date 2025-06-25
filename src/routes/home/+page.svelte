<script lang="ts">
	import { enhance } from '$app/forms';

  let {data} = $props();
</script>


<div>
  <h1>Welcome, {data.user.username}</h1>


  <div class="flex justify-end">
    <form action="?/logout" method="post" use:enhance>
      <button class="btn btn-secondary">Logout</button>
    </form>
  </div>
</div>
