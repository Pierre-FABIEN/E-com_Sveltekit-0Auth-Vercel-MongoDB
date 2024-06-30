<script>
	import { onMount, onDestroy } from 'svelte';
	import { threeStore } from '$stores/UX/threeStore';
	import * as THREE from 'three';

	let container;
	let localScene;
	let animationFrameId;
	let unsubscribe;

	onMount(() => {
		threeStore.initialize();
		localScene = threeStore.initialize();
		unsubscribe = threeStore.subscribe(({ renderer, camera }) => {
			if (renderer && container && !container.firstChild) {
				container.appendChild(renderer.domElement);
				renderer.setClearColor(0x000000, 0);
				renderer.setSize(500, 300);

				// Définir la géométrie du triangle
				const geometry = new THREE.BufferGeometry();
				const vertices = new Float32Array([
					0.0,
					1.0,
					0.0, // sommet A
					-1.0,
					-1.0,
					0.0, // sommet B
					1.0,
					-1.0,
					0.0 // sommet C
				]);
				geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

				const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
				const mesh = new THREE.Mesh(geometry, material);
				localScene.add(mesh);

				camera.position.set(0, 0, 2);

				function animate() {
					animationFrameId = requestAnimationFrame(animate);

					// Rotation du triangle
					mesh.rotation.x += 0.01;
					mesh.rotation.y += 0.01;
					mesh.rotation.z += 0.01;

					renderer.render(localScene, camera);
				}

				animate();
			}
		});
	});

	onDestroy(() => {
		threeStore.dispose();
		if (unsubscribe) unsubscribe();
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		// Ne disposez pas immédiatement des ressources ici si d'autres composants peuvent en avoir besoin
		// Considérez une logique conditionnelle ou basée sur un état pour déterminer quand disposer réellement les ressources
	});

	function cleanMaterial(material) {
		Object.keys(material).forEach((prop) => {
			if (material[prop] && typeof material[prop].dispose === 'function') {
				material[prop].dispose();
			}
		});
	}
</script>

<div bind:this={container}></div>

<style>
	div {
		width: 500px;
		height: 300px;
		display: block;
	}
</style>
