<script lang="ts">
	import { onMount } from 'svelte';
	import Editor from '@tinymce/tinymce-svelte';

	let content = '<p>This is the initial content of the editor.</p>';

	let init = {
		height: 500,
		menubar: false,
		plugins: [
			'advlist autolink lists link image charmap anchor searchreplace visualblocks code fullscreen insertdatetime media table preview help wordcount'
		],
		toolbar:
			'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
	};

	onMount(() => {
		// Function to override addEventListener to set passive event listeners for touchstart and touchmove
		(function () {
			const originalAddEventListener = EventTarget.prototype.addEventListener;
			const eventTypes = ['touchstart', 'touchmove'];

			EventTarget.prototype.addEventListener = function (type, listener, options) {
				if (eventTypes.includes(type)) {
					if (typeof options === 'object') {
						options.passive = true;
					} else {
						options = { passive: true };
					}
				}
				originalAddEventListener.call(this, type, listener, options);
			};
		})();
	});
</script>

<Editor
	apiKey="epn8p11zhf9z15k522lcfibbkq8d67lfg0f3rf0d03tub60o"
	channel="7"
	bind:value={content}
	{...init}
/>
