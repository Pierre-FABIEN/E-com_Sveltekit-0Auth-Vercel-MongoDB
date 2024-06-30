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

<style lang="scss">
  @import '../styles/utils/flex';
  .page {
    @include ccc;
    width: 100%;
    min-height: calc(100vh - 70px);

    .page-container {
        @include ccc;
        padding: 20px;
        border-radius: 15px;
        border: 1px solid black;

        form {
            @include cca;

            input {
                margin: 5px 0px;
            }
        }

        button {
            margin: 5px;
        }
    }
}
</style>