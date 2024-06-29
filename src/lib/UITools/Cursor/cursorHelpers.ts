import { cursorStore } from '$stores/UX/cursorStore';
import { shapeStore } from '$stores/UX/shapeStore';
import animations from './animations';

let animationFrameId: number;

export function animateCursor(
	Cursor: HTMLElement | null,
	{ clientX, clientY }: { clientX: number; clientY: number }
): void {
	if (!Cursor) return;
	cancelAnimationFrame(animationFrameId);
	animationFrameId = requestAnimationFrame(() => {
		const newX: number = clientX - Cursor.offsetWidth / 2;
		const newY: number = clientY - Cursor.offsetHeight / 2;

		cursorStore.update((prevState) => ({
			...prevState,
			x: newX,
			y: newY
		}));
	});
}

export function updateCursorByName(name: string, changeShaper: (shape: string) => void): void {
	const animation = animations.find((animation) => animation.name === name);
	if (animation) {
		const { transitionDuration, shaperForm, scaleSvg, transitionDurationSvg, colorsvg } = animation;
		cursorStore.update((props) => ({
			...props,
			transitionDuration,
			transitionDurationSvg,
			scaleSvg,
			colorsvg
		}));
		changeShaper(shaperForm);
	}
}

export function resetCursor(changeShaper: (shape: string) => void): void {
	cursorStore.update((props) => ({
		...props,
		transitionDuration: 0.02,
		transitionDurationSvg: 0.02,
		scaleSvg: 1,
		colorsvg: '#000000'
	}));
	changeShaper('circle');
}

export function hoverable(
	node: HTMLElement,
	animationName: string,
	parentHoverableType?: string
): { destroy: () => void } {
	let isHovering = false;

	const handleCursorUpdate = (e: MouseEvent) => {
		if (node.contains(e.target as Node)) {
			if (!isHovering) {
				isHovering = true;
				updateCursorByName(animationName, shapeStore.set);
			}
		} else {
			if (isHovering) {
				isHovering = false;
				// Vérifie si un parent a un hoverable spécifique
				const parentHoverableNode = parentHoverableType
					? findParentWithHoverable(node, parentHoverableType)
					: null;
				if (parentHoverableNode) {
					updateCursorByName(parentHoverableNode.getAttribute('use:hoverable'), shapeStore.set);
				} else {
					resetCursor(shapeStore.set);
				}
			}
		}
	};

	window.addEventListener('mousemove', handleCursorUpdate);

	return {
		destroy() {
			window.removeEventListener('mousemove', handleCursorUpdate);
		}
	};
}

function findParentWithHoverable(node, hoverableType) {
	while (node && node !== document.body) {
		if (node.getAttribute('use:hoverable') === hoverableType) {
			return node;
		}
		node = node.parentNode;
	}
	return null;
}
