<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form method="post" action="?/upload">
	<label for="file-upload">Select file :</label>
	<input type="file" id="file-upload" name="file-upload" />
	<button type="submit">Upload</button>
</form>
