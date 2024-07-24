import gsap from 'gsap';
// import { wrapNewLines } from '$lib/js/wrapNewLines';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import type Scrollbar from 'smooth-scrollbar';
import { get } from 'svelte/store';
import smoothScrollStore from '$stores/UX/scrollStore';

let smoothScroll: Scrollbar | null = null;

const duration = 1;

// Obtenir la valeur actuelle du store
const initSmoothScroll = () => {
	smoothScroll = get(smoothScrollStore);
};

export const enter = (node: any, { pathIn }: any) => {
	gsap.registerPlugin(ScrollTrigger);
	// if ((pathIn = '/')) {
	//     //console.log('declenchement de sortie pour la page HOME');
	// }

	const timeline = gsap.timeline({ defaults: { duration } });

	timeline.from(node, {
		opacity: 1,
		x: '100vw',
		ease: 'power2.out'
	});

	return {
		delay: 0,
		duration: timeline.duration() * 1000,
		css: () => ``
	};
};

export const exit = (node: any, { pathOut }: any) => {
	gsap.registerPlugin(ScrollTrigger);
	// console.log('pathOut', pathOut);

	// if ((pathOut = '/')) {
	//     //console.log('declenchement de sortie pour la page HOME');
	// }

	initSmoothScroll(); // Initialise smoothScroll
	if (smoothScroll) {
		smoothScroll.scrollTo(0, 0, 500);
	}

	const timeline = gsap.timeline({ defaults: { duration } });
	timeline.to(node, {
		opacity: 1,
		x: '100vw',
		ease: 'power2.out'
	});

	return {
		delay: 0,
		duration: timeline.duration() * 1000,
		css: () => ``
	};
};
