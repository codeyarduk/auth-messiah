import { Hono } from 'hono';
import type { Bindings } from '../app.d.ts';
import { deleteCookie } from 'hono/cookie';

const logoutAll = new Hono<{ Bindings: Bindings }>();

logoutAll.post('/', async (c) => {
	const newIAT = Date.now();
	const uuid = c.get('uuid');
	await c.env.DB.prepare('UPDATE users SET iat = ? WHERE id = ?').bind(newIAT).bind(uuid).run();
	deleteCookie(c, 'accessToken', {
		path: '/',
		secure: true,
		domain: c.env.SITE_URL,
	});
	deleteCookie(c, 'refreshToken', {
		path: '/',
		secure: true,
	});

	return c.json('Logged out all sessions');
});

export { logoutAll };
