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

				const geometry = new THREE.BoxGeometry(1, 1, 1); // Ou SphereGeometry pour la sphère
				const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
				const mesh = new THREE.Mesh(geometry, material);
				localScene.add(mesh);

				camera.position.set(0, 0, 5);

				function animate() {
					animationFrameId = requestAnimationFrame(animate);
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
		width: 100%;
		height: 100vh;
		display: block;
	}
</style>