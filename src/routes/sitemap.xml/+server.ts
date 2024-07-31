import { getAllPosts } from '$requests/posts/getAllPosts';
import type { RequestHandler } from '@sveltejs/kit';
import * as sitemap from 'super-sitemap';

export const prerender = true; // Facultatif, utile si vous utilisez le pré-rendu

export const GET: RequestHandler = async (event) => {
	const shopId = await getAllPosts();
	const shopKey = [];

	shopId.forEach((element) => {
		shopKey.push(element.id);
	});

	console.log(shopKey, 'oiuhliuh');

	return await sitemap.response({
		origin: 'http://localhost:1000', // Remplacez par l'URL de votre site
		excludePatterns: ['^/dashboard', '^/profile', '^/signin', '^/signout'],
		paramValues: {
			'/shop/[id]': shopKey
		}
	});
};
