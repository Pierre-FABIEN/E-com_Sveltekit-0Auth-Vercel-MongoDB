import { writable } from 'svelte/store';

type CursorProps = {
	Cursor?: HTMLElement | null;
	x: number;
	y: number;
	transitionDuration: number;
	transitionDurationSvg: number;
	shaperForm: string;
	scaleSvg: number;
};

export const cursorStore = writable({
	Cursor: null,
	x: 0,
	y: 0,
	transitionDuration: 0,
	transitionDurationSvg: 0.07,
	shaperForm: 'circle',
	scaleSvg: 1,
	colorSVG: '#000000'
});
