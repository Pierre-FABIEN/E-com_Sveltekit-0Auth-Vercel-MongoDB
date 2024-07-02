import gsap from 'gsap';

import type Scrollbar from 'smooth-scrollbar';
import { get } from 'svelte/store';
import smoothScrollStore from '$stores/UX/scrollStore';

let smoothScroll: Scrollbar | null = null;
const duration = 1;

const initSmoothScroll = () => {
	smoothScroll = get(smoothScrollStore);
};

export const enter = (node: any, { pathIn }: any) => {
	const timeline = gsap.timeline({ defaults: { duration } });
	timeline.from(node, {
		opacity: 0,
		x: '-100vw',
		ease: 'power2.out'
	});

	return {
		delay: 0,
		duration: timeline.duration() * 1000,
		css: () => ``
	};
};

export const exit = (node: any, { pathOut }: any) => {
	initSmoothScroll(); // Initialise smoothScroll
	if (smoothScroll) {
		smoothScroll.scrollTo(0, 0, 500);
	}

	const timeline = gsap.timeline({ defaults: { duration } });

	timeline.to(node, {
		opacity: 0,
		x: '-100vw',
		ease: 'power2.out'
	});

	return {
		delay: 0,
		duration: timeline.duration() * 1000,
		css: () => ``
	};
};
