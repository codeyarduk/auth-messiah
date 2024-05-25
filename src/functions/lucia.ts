import { Lucia } from 'lucia';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import type { D1Database } from '@cloudflare/workers-types';

export function initializeLucia(D1: D1Database) {
	const adapter = new D1Adapter(D1, {
		user: 'users',
		session: 'sessions',
	});
	return new Lucia(adapter);
}

declare module 'lucia' {
	interface Auth extends ReturnType<typeof initializeLucia> {}
}
