<script lang="ts">
	import { page } from '$app/stores';
	import DarkMode from '$UITools/DarkMode/index.svelte';
	import * as DropdownMenu from '$UITools/shadcn/dropdown-menu';

	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import FullScreen from '$UITools/FullScreen/FullScreen.svelte';
	import Selector from '$UITools/Translations/Selector.svelte';

	console.log('page', $page.data.session?.user.role);
</script>

<header>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/shop' ? 'page' : undefined}>
				<a href="/shop">shop</a>
			</li>
			<li aria-current={$page.url.pathname === '/transitionAPI' ? 'page' : undefined}>
				<a href="/transitionAPI">transitionAPI</a>
			</li>
			<li aria-current={$page.url.pathname === '/protected' ? 'page' : undefined}>
				<a href="/protected">Protected</a>
			</li>
		</ul>
	</nav>

	<div class="left-side">
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
					{#if $page.data.session?.user}
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<a href="/profile" class="w-[100%]">Profile</a>
						</DropdownMenu.Item>
					{/if}
					{#if $page.data.session?.user.role === 'admin'}
						<DropdownMenu.Item>
							<a href="/dashboard" class="w-[100%]">Dashboard</a>
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
	@import '../styles/utils/flex';
	header {
		@include rcb;
		padding: 20px;

		width: 100%;
		height: 70px;
		position: absolute;
		z-index: 10;
		top: 0;

		ul {
			width: 500px;
			@include rcb;
		}

		.left-side {
			@include rcc;
		}
	}
</style>
