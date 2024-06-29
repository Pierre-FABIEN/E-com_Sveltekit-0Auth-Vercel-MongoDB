import * as THREE from 'three';

class HelperService {
	public addGrid(scene: THREE.Scene) {
		const size = 10;
		const divisions = 10;
		const gridHelper = new THREE.GridHelper(size, divisions);
		scene.add(gridHelper);
	}

	public addAxes(scene: THREE.Scene) {
		const axesHelper = new THREE.AxesHelper(5);
		scene.add(axesHelper);
	}
}

export const helperService = new HelperService();
