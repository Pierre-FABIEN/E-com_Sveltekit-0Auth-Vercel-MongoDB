<script lang="ts">
	import { windowStore } from '$stores/UX/windowStore';
	import smoothScrollStore from '$stores/UX/scrollStore';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/dist/ScrollTrigger';
	import Scrollbar from 'smooth-scrollbar';
	import { onMount } from 'svelte';

	let scrollX = 0;
	let scrollY = 0;
	let smoothScoller: HTMLElement;
	let smoothScroll: Scrollbar;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		if (!smoothScoller) {
			throw new Error('Element #smoothScoller not found');
		}

		smoothScroll = Scrollbar.init(smoothScoller, {
			damping: 0.1,
			delegateTo: document,
			alwaysShowTracks: true
		}) as Scrollbar;
		smoothScrollStore.set(smoothScroll as any);

		smoothScroll.addListener((status) => {
			scrollX = status.offset.x;
			scrollY = status.offset.y;
			windowStore.update((store) => {
				store.scrollX = scrollX;
				store.scrollY = scrollY;
				return store;
			});
		});

		ScrollTrigger.scrollerProxy(smoothScoller, {
			scrollTop(value) {
				if (arguments.length) {
					if (typeof smoothScroll.scrollTop === 'number') {
						smoothScroll.scrollTop = value ?? 0;
					}
				}
				return smoothScroll.scrollTop ?? 0;
			}
		});

		smoothScroll.addListener(ScrollTrigger.update);

		ScrollTrigger.defaults({
			scroller: smoothScoller,
			pinType: 'transform'
		});

		return () => {
			smoothScroll.removeListener(ScrollTrigger.update);
		};
	});
</script>

<div bind:this={smoothScoller} class="smoothScoller" id="smoothScoller">
	<slot />
</div>
