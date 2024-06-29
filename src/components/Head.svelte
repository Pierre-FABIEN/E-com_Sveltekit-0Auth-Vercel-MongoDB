<script lang="ts">
  import { page } from '$app/stores'
  import DarkMode from '$UITools/DarkMode/index.svelte'
  import { t, locale, locales } from '$UITools/Translations/index'
  import { SignIn, SignOut } from "@auth/sveltekit/components"

  import FullScreen from './FullScreen.svelte'

  const handleChange = (event: Event) => {
    const currentTarget = event.currentTarget as HTMLSelectElement // Cast ici si vous êtes sûr que c'est un élément select
    const { value } = currentTarget

    document.cookie = `lang=${value};`
    location.reload()
  }
</script>

<header>
  <nav>
    <ul>
      <li aria-current="{$page.url.pathname === '/' ? 'page' : undefined}">
        <a href="/">Home</a>
      </li>
      <li aria-current="{$page.url.pathname === '/about' ? 'page' : undefined}">
        <a href="/about">About</a>
      </li>
      <li
        aria-current="{$page.url.pathname === '/transitionAPI'
          ? 'page'
          : undefined}"
      >
        <a href="/transitionAPI">transitionAPI</a>
      </li>
      <li
        aria-current="{$page.url.pathname === '/protected'
          ? 'page'
          : undefined}"
      >
        <a href="/protected">Protected</a>

      </li>
    </ul>
  </nav>

  <div class="left-side">
    <div class="signedInStatus">
      <div class="nojs-show loaded">
        <img
        width="25px"
        height="25px"
          alt="User avatar"
          src={$page.data?.session?.user?.image ??
            "https://source.boringavatars.com/marble/120"}
          class="avatar"
        />
        {#if $page.data.session}
          <span class="signedInText">
            {$page.data.session.user?.email ?? $page.data.session.user?.name}
          </span>
          <SignOut>
            <div slot="submitButton" class="buttonPrimary">Sign out</div>
          </SignOut>
        {:else}
          <span class="notSignedInText">You are not signed in</span>
          <SignIn>
            <div slot="submitButton" class="buttonPrimary">Sign in</div>
          </SignIn>
        {/if}
      </div>
    </div>
  
    <label for="localeSelect">{$t('data.language')}</label>
    <select
      id="localeSelect"
      name="locale"
      bind:value="{$locale}"
      on:change="{handleChange}"
    >
      {#each $locales as value}
        <option value="{value}">{$t(`data.${value}`)}</option>
      {/each}
    </select>

    <DarkMode />

    <FullScreen />
  </div>
</header>
