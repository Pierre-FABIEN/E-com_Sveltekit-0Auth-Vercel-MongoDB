import * as THREE from 'three';

class SceneService {
	public scene: THREE.Scene;

	constructor() {
		this.scene = new THREE.Scene();
	}

	public add(object: THREE.Object3D) {
		this.scene.add(object);
	}

	public remove(object: THREE.Object3D) {
		this.scene.remove(object);
	}
}

export const sceneService = new SceneService();
