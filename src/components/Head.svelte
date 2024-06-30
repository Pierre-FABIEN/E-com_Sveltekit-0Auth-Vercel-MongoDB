<script lang="ts">
	import { page } from '$app/stores';
	import DarkMode from '$UITools/DarkMode/index.svelte';

	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import FullScreen from '$UITools/FullScreen/FullScreen.svelte';
	import Selector from '$UITools/Translations/Selector.svelte';
</script>

<header>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
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
		<div class="signedInStatus">
			<div class="nojs-show loaded">
				<img
					width="25px"
					height="25px"
					alt="User avatar"
					src={$page.data?.session?.user?.image ?? 'https://source.boringavatars.com/marble/120'}
					class="avatar"
				/>
				{#if $page.data.session}
					<span class="signedInText">
						{$page.data.session.user?.email ?? $page.data.session.user?.name}
					</span>
					<SignOut>
						<div slot="submitButton" class="buttonPrimary">Sign out</div>
					</SignOut>
				{:else}
					<span class="notSignedInText">You are not signed in</span>
					<SignIn>
						<div slot="submitButton" class="buttonPrimary">Sign in</div>
					</SignIn>
				{/if}
			</div>
		</div>

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
		z-index: 100;
		top: 0;
		ul {
			width: 500px;
			@include rcb;
		}

		.left-side {
			@include rcc;

			.nojs-show {
				@include rcc;
			}
		}
	}
</style>
