<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import TextAlign from '@tiptap/extension-text-align';
	import Image from '@tiptap/extension-image';
	import { onMount } from 'svelte';

	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			extensions: [
				StarterKit,
				TextAlign.configure({
					types: ['heading', 'paragraph']
				}),
				Image
			],
			content: '<p>Hello World!</p>'
		});

		return () => {
			editor.destroy();
		};
	});

	function toggleBold() {
		editor.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor.chain().focus().toggleItalic().run();
	}

	function setTextAlign(align: 'left' | 'center' | 'right' | 'justify') {
		editor.chain().focus().setTextAlign(align).run();
	}
</script>

<div>
	<button on:click={toggleBold}>Bold</button>
	<button on:click={toggleItalic}>Italic</button>
	<button on:click={() => setTextAlign('left')}>Left</button>
	<button on:click={() => setTextAlign('center')}>Center</button>
	<button on:click={() => setTextAlign('right')}>Right</button>
	<button on:click={() => setTextAlign('justify')}>Justify</button>
</div>

<div id="editor" bind:this={editor}>
	<!-- TipTap content will be rendered here -->
</div>

<style>
	#editor {
		min-height: 300px;
		border: 1px solid #ccc;
		padding: 10px;
	}
</style>
