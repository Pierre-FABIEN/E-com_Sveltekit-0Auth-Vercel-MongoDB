import * as THREE from 'three';

class LoaderService {
	private loader = new THREE.TextureLoader();

	public loadTexture(url: string): Promise<THREE.Texture> {
		return new Promise((resolve, reject) => {
			this.loader.load(url, resolve, undefined, reject);
		});
	}
}

export const loaderService = new LoaderService();
