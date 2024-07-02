/// <reference types="@auth/sveltekit" />
// TS.d.ts
import { NextFunction } from 'express';

declare global {
	namespace App {
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

		type User = {
			name: string;
			email: string;
			image: string;
			addresses: Address[];
			orders: Order[];
		};
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
