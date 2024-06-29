import i18n from 'sveltekit-i18n'
import { dev } from '$app/environment'
import lang from './lang.json'

export const defaultLocale = 'en'

/** @type {import('sveltekit-i18n').Config} */
export const config = {
  log: {
    level: dev ? 'warn' : 'error',
  },
  translations: {
    en: { lang },
    fr: { lang },
  },
  loaders: [
    {
      locale: 'en',
      key: 'data',
      loader: async () =>
        (await import('./../../translateJson/en/data.json')).default,
    },
    {
      locale: 'fr',
      key: 'data',
      loader: async () =>
        (await import('./../../translateJson/fr/data.json')).default,
    },
  ],
}

export const {
  t,
  loading,
  locales,
  locale,
  translations,
  loadTranslations,
  addTranslations,
  setLocale,
  setRoute,
} = new i18n(config)

loading.subscribe(($loading) => $loading)
