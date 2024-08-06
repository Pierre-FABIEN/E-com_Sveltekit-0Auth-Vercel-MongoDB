import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	image: z.string().optional(),
	role: z.string(),
	createdAt: z.date(),
	updatedAt: z.date()
});

export const postSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	authorId: z.string()
});

export const deletePostSchema = z.object({
	id: z.string()
});
