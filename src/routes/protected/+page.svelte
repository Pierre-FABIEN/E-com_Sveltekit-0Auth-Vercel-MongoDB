<script lang="ts">
  import { page } from "$app/stores"
	import { onMount } from "svelte";
	import type { PageData } from "../$types";

  export let data: PageData

  onMount(() => {
    console.log(data);
  })
</script>

<div class="page">
  {#if $page.data.session}
    <h1>Protected page</h1>
    <img src="{$page.data.session.user.image}" alt="logo">
    <p>
      This is a protected content. You can access this content because you are
      signed in.
    </p>
    <p>Session expiry: {$page.data.session?.expires}</p>
  {:else}
    <h1>Access Denied</h1>
  {/if}


  {#if $page.data.session?.user.role === 'admin' }
  <h1>your are admin</h1>
  {/if}
</div>