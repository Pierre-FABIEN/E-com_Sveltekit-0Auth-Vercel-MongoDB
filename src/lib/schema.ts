// src/lib/schema.ts
import { z } from 'zod';

export const schema = z.object({
	images: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < 100_000, 'Max 100 kB upload size.')
		.array()
});
