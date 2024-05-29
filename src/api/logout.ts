import { Hono } from 'hono';
import { initializeLucia } from '../functions/lucia';
import type { Bindings } from '../app.d.ts';
import { Context } from 'hono';
const logout = new Hono<{ Bindings: Bindings }>();

logout.post('/', async (c: Context) => {
	const lucia = initializeLucia(c.env.DB);
	const session = c.get('session');
	if (session) {
		await lucia.invalidateSession(session.id);
	}
	const sessionCookie = lucia.createBlankSessionCookie();
	c.header('Set-Cookie', sessionCookie.serialize(), {
		append: true,
	});
	return c.json('Logged out');
});

export { logout };
