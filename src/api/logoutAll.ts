import { Hono } from 'hono';
import { initializeLucia } from '../functions/lucia';
import type { Bindings } from '../app.d.ts';
import { Context } from 'hono';

const logoutAll = new Hono<{ Bindings: Bindings }>();

logoutAll.post('/', async (c: Context) => {
	const lucia = initializeLucia(c.env.DB);
	const session = c.get('session');
	if (session) {
		await lucia.invalidateUserSessions(session.user_id);
	}
	const sessionCookie = lucia.createBlankSessionCookie();
	c.header('Set-Cookie', sessionCookie.serialize(), {
		append: true,
	});
	return c.json('Logged out all sessions');
});

export { logoutAll };
