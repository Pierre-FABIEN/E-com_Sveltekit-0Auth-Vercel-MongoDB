import { addTranslations, setLocale, setRoute } from '$UITools/Translations'

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ data }) => {
  const { i18n, translations, session } = data 
  const { locale, route } = i18n

  addTranslations(translations)

  await setRoute(route)
  await setLocale(locale)  

  return { ...i18n, session }
}