import { Lucia } from 'lucia';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import type { D1Database } from '@cloudflare/workers-types';
import type { DatabaseUserAttributes } from '../app.d.ts';

export function initializeLucia(D1: D1Database) {
	const adapter = new D1Adapter(D1, {
		user: 'users',
		session: 'sessions',
	});
	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: false,
			},
		},
		getUserAttributes: (attributes) => {
			return {
				email: attributes.email,
				emailVerified: Boolean(attributes.email_verified),
			};
		},
	});
}

declare module 'lucia' {
	interface Register {
		Auth: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
