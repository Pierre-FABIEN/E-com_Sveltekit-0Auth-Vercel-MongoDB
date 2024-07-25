import type { RequestHandler } from '@sveltejs/kit';
import * as sitemap from 'super-sitemap';

export const prerender = true; // Facultatif, utile si vous utilisez le pré-rendu

export const GET: RequestHandler = async () => {
	return await sitemap.response({
		origin: 'http://localhost:1000', // Remplacez par l'URL de votre site
		excludePatterns: ['^/dashboard', '^/profile', '^/cancel', '^/success', '^/signin', '^/signout']
	});
};
