<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="navbar bg-base-200 rounded-2xl">
	<div class="navbar-start md:hidden">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/>
				</svg>
			</div>
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
				<li>
					<a href="/lists" aria-current={page.url.pathname === '/lists'}>Lists</a>
				</li>
				<li>
					<a href="/search" aria-current={page.url.pathname === '/search'}>Search</a>
				</li>
				<li>
					<a href="/groups" aria-current={page.url.pathname === '/groups'}>Groups</a>
				</li>
				<li>
					<a href="/friends" aria-current={page.url.pathname === '/friends'}>Friends</a>
				</li>
			</ul>
		</div>
	</div>
	<div class="navbar-start hidden md:flex">
		<a class="btn btn-ghost text-xl" href="/home">My Lists</a>
	</div>
	<div class="navbar-center md:hidden">
		<a class="btn btn-ghost text-xl" href="/home">My Lists</a>
	</div>
	<div class="hidden navbar-center md:flex">
		<ul class="menu menu-horizontal px-1">
			<li>
				<a href="/lists" aria-current={page.url.pathname === '/lists'}>Lists</a>
			</li>
			<li>
				<a href="/search" aria-current={page.url.pathname === '/search'}>Search</a>
			</li>
			<li>
				<a href="/groups" aria-current={page.url.pathname === '/groups'}>Groups</a>
			</li>
			<li>
				<a href="/friends" aria-current={page.url.pathname === '/friends'}>Friends</a>
			</li>
		</ul>
	</div>
	<div class="navbar-end">
		<!-- <button class="btn btn-ghost btn-circle" aria-label="Notifications">
			<div class="indicator">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>
				<span class="badge badge-xs badge-primary indicator-item"></span>
			</div>
		</button> -->
	</div>
</div>
