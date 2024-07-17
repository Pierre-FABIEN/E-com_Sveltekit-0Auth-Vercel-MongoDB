/// <reference types="@auth/sveltekit" />
// TS.d.ts

declare global {
	namespace App {
		export type PageLoad<Data = any> = (input: { data: Data }) => Promise<{}>;

		interface Locals {
			getSession: () => Promise<Session | null>;
			role?: string; // Ajout de la propriété 'role'
		}

		interface Session {
			user: {
				email: string;
				name: string;
				role: string;
			};
		}
	}

	namespace TS {
		interface AnimationOptions {
			x?: number;
			y?: number;
			duration: number;
			delay?: number;
		}

		interface Notification {
			id: number;
			message: string;
			type: string; // ou enum si vous avez des types spécifiques
		}

		type TranslationFunction = (key: string, options?: any) => string;
	}
}
export {};
