import gsap from 'gsap';
import { wrapNewLines } from '$lib/js/wrapNewLines';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
const duration = 1;

export const enter = (node: any, { pathIn, title, text, link }) => {
	gsap.registerPlugin(ScrollTrigger);
	if ((pathIn = '/')) {
		//console.log('declenchement de sortie pour la page HOME');
	}

	const timeline = gsap.timeline({ defaults: { duration } });

	timeline.from(node, {
		opacity: 1,
		x: '100vw',
		ease: 'power2.out'
	});

	timeline.from(link, {
		opacity: 0,
		y: 100,
		ease: 'power2.out'
	});

	wrapNewLines(title, 'span', 'line', 'subline');
	wrapNewLines(text, 'span', 'line', 'subline');

	gsap.set('.subline', {
		y: '200px',
		opacity: 0
	});

	gsap.to('.subline', {
		y: '0px',
		opacity: 1,
		duration: 0.4,
		stagger: 0.04,
		skewY: 0,
		skewX: 0
	});

	return {
		delay: 0,
		duration: timeline.duration() * 1000,
		css: () => ``
	};
};

export const exit = (node: any, { pathOut, title, text, link }) => {
	gsap.registerPlugin(ScrollTrigger);
	//console.log('pathOut', pathOut);

	if ((pathOut = '/')) {
		//console.log('declenchement de sortie pour la page HOME');
	}

	const timeline = gsap.timeline({ defaults: { duration } });
	timeline.to(node, {
		opacity: 1,
		x: '100vw',
		ease: 'power2.out'
	});

	timeline.set(node, {
		opacity: 0,
		x: '0vw',
		y: 0,
		ease: 'power2.out'
	});

	timeline.to(link, {
		opacity: 0,
		y: -100,
		ease: 'power2.in'
	});

	return {
		delay: 0,
		duration: timeline.duration() * 1000,
		css: () => ``
	};
};
