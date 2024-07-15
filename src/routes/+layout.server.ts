import type { LayoutServerLoad } from './$types';
import { locales, loadTranslations, translations, defaultLocale } from '$UITools/Translations';

import { checkOrRegister } from '$requests/user/checkOrRegister';
import { getAllProducts } from '$requests/product/getAllProducts';
import { getAllCategories } from '$requests/categories/getAllCategories';
import { getPendingOrder } from '$requests/orders/getPendingOrder';

export const load: LayoutServerLoad = async (event) => {
	const { url, cookies, request, locals } = event;
	const { pathname } = url;

	const AllProducts = await getAllProducts();
	const AllCategories = await getAllCategories();

	const session = await locals.getSession();
	const user = await checkOrRegister(session);
	let pendingOrder = null;

	if (user && session) {
		session.user.role = user.role;
		pendingOrder = await getPendingOrder(user.id);
		console.log('pendingOrder:', pendingOrder);
		
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
		AllProducts,
		AllCategories,
		session,
		i18n: { locale, route: pathname },
		translations: translations.get() // Return loaded translations
	};
};
