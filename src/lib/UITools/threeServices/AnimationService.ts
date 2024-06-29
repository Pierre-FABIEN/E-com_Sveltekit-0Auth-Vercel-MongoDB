import * as THREE from 'three';

class AnimationService {
	private animations: (() => void)[] = [];

	public add(animationFn: () => void) {
		this.animations.push(animationFn);
	}

	public remove(animationFn: () => void) {
		const index = this.animations.indexOf(animationFn);
		if (index > -1) {
			this.animations.splice(index, 1);
		}
	}

	public animate() {
		this.animations.forEach((animationFn) => animationFn());
	}
}

export const animationService = new AnimationService();
