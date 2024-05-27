import { Hono } from 'hono';
import { initializeLucia } from '../functions/lucia';
import type { Bindings } from '../app.d.ts';

const logoutAll = new Hono<{ Bindings: Bindings }>();

logoutAll.post('/', async (c) => {
	const lucia = initializeLucia(c.env.DB);
	const session = c.get('session') as any;
	if (session) {
		await lucia.invalidateUserSessions(session.user_id);
	}
	const sessionCookie = lucia.createBlankSessionCookie();
	return c.header('Set-Cookie', sessionCookie.serialize(), {
		append: true,
	});
	// return c.json('Logged out');
});

export { logoutAll };
