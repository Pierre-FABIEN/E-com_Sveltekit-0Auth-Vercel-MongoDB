import type { LayoutServerLoad } from './$types';
import { locales, loadTranslations, translations, defaultLocale } from '$UITools/Translations';

import { checkOrRegister } from '$server/user/checkOrRegister';

import { getPendingOrder } from '$server/orders/getPendingOrder';
import { getproductsAndCategories } from '$server/LayoutData/getproductsAndCategories';
import { getUserDetails } from '$server/user/getUserDetails';

export const load: LayoutServerLoad = async (event) => {
	const { url, cookies, request, locals } = event;
	const { pathname } = url;

	const { products, categories } = await getproductsAndCategories();

	const session = await locals.getSession();
	const user = await checkOrRegister(session);

	let pendingOrder = null;

	if (user && session) {
		session.user.role = user.role;
		pendingOrder = await getPendingOrder(user.id);

		session.user.id = user.id;
		session.orders = pendingOrder;
	}

	// Try to get the locale from cookie
	let locale = (cookies.get('lang') || '').toLowerCase();

	// Get user preferred locale
	if (!locale) {
		const acceptLanguageHeader = request.headers.get('accept-language') || '';
		locale = (acceptLanguageHeader.match(/[a-zA-Z]+?(?=-|_|,|;)/) || [
			defaultLocale
		])[0].toLowerCase();
	}

	// Get defined locales
	const supportedLocales = locales.get().map((l) => l.toLowerCase());

	// Use default locale if current locale is not supported
	if (!supportedLocales.includes(locale)) {
		locale = defaultLocale;
	}

	await loadTranslations(locale, pathname); // Load translations for the current locale and path

	return {
		products,
		categories,
		session,
		i18n: { locale, route: pathname },
		translations: translations.get() // Return loaded translations
	};
};
