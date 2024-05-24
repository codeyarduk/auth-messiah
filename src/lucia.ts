import { lucia } from 'lucia';
import { hono } from 'lucia/middleware';
import { d1 } from '@lucia-auth/adapter-sqlite';

export const initializeLucia = (DB: D1Database) => {
	const auth = lucia({
		adapter: d1(DB, {
			user: 'user',
			key: 'user_key',
			session: 'user_session',
		}),
		env: 'DEV',
		middleware: hono(),
	});
	return auth;
};

export type Auth = ReturnType<typeof initializeLucia>;
