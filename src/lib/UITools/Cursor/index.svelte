<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import * as flubber from 'flubber';
	const { interpolate } = flubber;

	import bankPath from './bankPath/index';
	import { shapeStore } from '$stores/UX/shapeStore';
	import { cursorStore } from '$stores/UX/cursorStore';
	import { animateCursor } from './cursorHelpers';

	// Type pour le store cursorStore
	type CursorProps = {
		x: number;
		y: number;
		Cursor?: HTMLElement;
	};

	const changeShaper = shapeStore.set;
	let cursorElement: HTMLElement | null = null;

	let animationFrameId: number | null = null;
	let throttledMove: ((...args: any[]) => any) | null = null;

	function throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
		let lastCall = 0;
		return function (...args: any[]) {
			const now = new Date().getTime();
			if (now - lastCall < delay) {
				return;
			}
			lastCall = now;
			return func(...args);
		} as T;
	}

	// Initialise and clean up event listeners
	if (typeof window !== 'undefined') {
		onMount(() => {
			cursorElement = document.getElementById('Cursor');
			initEventListeners(cursorElement);
		});

		onDestroy(() => {
			removeEventListeners();
		});
	}

	export function initEventListeners(Cursor: HTMLElement | null) {
		throttledMove = throttle((e) => animateCursor(Cursor, e), 16);
		cursorStore.update((props) => ({ ...props, Cursor }));
		window.addEventListener('mousemove', throttledMove);
	}

	export function removeEventListeners() {
		if (throttledMove) {
			window.removeEventListener('mousemove', throttledMove);
		}
	}

	const shape = tweened(bankPath['circle'], {
		duration: 250,
		easing: cubicInOut,
		interpolate: interpolate
	});

	$: shape.set(bankPath[$shapeStore]);
</script>

<div
	bind:this={cursorElement}
	id="Cursor"
	style="
  transform: translate({$cursorStore.x}px, {$cursorStore.y}px);
  transition: transform {$cursorStore.transitionDuration}s linear;
  --icon-scale: {$cursorStore.iconScale};
  "
>
	<svg
		viewBox="0 0 100 100"
		style="
		transform: scale({$cursorStore.scaleSvg});
		transition: transform {$cursorStore.transitionDurationSvg}s linear;
		fill: {$cursorStore.colorsvg};
		"
	>
		{#if $shape}
			<path d={$shape} />
		{/if}
	</svg>
</div>

<style lang="scss">
	#Cursor {
		z-index: 1001;
		width: 50px;
		height: 50px;
		position: fixed;
		pointer-events: none;
	}
</style>
