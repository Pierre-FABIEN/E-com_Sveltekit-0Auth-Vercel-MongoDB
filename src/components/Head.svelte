<script lang="ts">
	import { page } from '$app/stores';
	import DarkMode from '$UITools/DarkMode/index.svelte';
	import * as DropdownMenu from '$shadcn/dropdown-menu';

	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import FullScreen from '$UITools/FullScreen/FullScreen.svelte';
	import Selector from '$UITools/Translations/Selector.svelte';
	import Cart from './Cart/Cart.svelte';

	//console.log('page', $page.data.session?.user.role);
	export let data;
</script>

<header class="rcb">
	<nav>
		<ul class="rcb">
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a data-sveltekit-preload-data href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/shop' ? 'page' : undefined}>
				<a data-sveltekit-preload-data href="/shop">shop</a>
			</li>
			<li aria-current={$page.url.pathname === '/transitionAPI' ? 'page' : undefined}>
				<a data-sveltekit-preload-data href="/transitionAPI">transitionAPI</a>
			</li>
			<li aria-current={$page.url.pathname === '/protected' ? 'page' : undefined}>
				<a data-sveltekit-preload-data href="/protected">Protected</a>
			</li>
			<li aria-current={$page.url.pathname === '/blog' ? 'page' : undefined}>
				<a data-sveltekit-preload-data href="/blog">Blog</a>
			</li>
		</ul>
	</nav>

	<div class="left-side rcc">
		{#if $page.data.session?.user.role === 'user'}
			<Cart {data} />
		{/if}

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<img
					width="40px"
					height="40px"
					alt="User avatar"
					src={$page.data?.session?.user?.image ?? 'https://source.boringavatars.com/marble/120'}
					class="avatar"
				/>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>
						{#if $page.data.session}
							<SignOut>
								<div slot="submitButton" class="buttonPrimary">Sign out</div>
							</SignOut>
						{:else}
							<SignIn>
								<div slot="submitButton" class="buttonPrimary">Sign in</div>
							</SignIn>
						{/if}
					</DropdownMenu.Label>
					{#if $page.data.session?.user.role === 'user'}
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<a data-sveltekit-preload-data href="/profile" class="w-[100%]">Profile</a>
						</DropdownMenu.Item>
					{/if}
					{#if $page.data.session?.user.role === 'admin'}
						<DropdownMenu.Item>
							<a data-sveltekit-preload-data href="/dashboard" class="w-[100%]">Dashboard</a>
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<Selector />

		<DarkMode />

		<FullScreen />
	</div>
</header>

<style lang="scss">
	header {
		padding: 20px;

		width: 100%;
		height: 70px;
		position: absolute;
		z-index: 10;
		top: 0;

		ul {
			width: 500px;
		}
	}
</style>
