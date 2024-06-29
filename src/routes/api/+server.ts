import prisma from '$lib/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    try {
        console.log('Connecting to database...');
        const data = await prisma.data.findMany();
        return new Response(JSON.stringify({ data }), { status: 200 });
    } catch (error: any) {
        console.error('Failed to fetch data:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch data', details: error.message }), { status: 500 });
    }
};
