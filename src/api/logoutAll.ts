import { Hono } from 'hono';
import type { Bindings } from '../app.d.ts';
import { verify } from 'hono/jwt';
import { deleteCookie, getCookie } from 'hono/cookie';

const logoutAll = new Hono<{ Bindings: Bindings }>();

logoutAll.post('/', async (c) => {
	const accessToken = getCookie(c, 'accessToken');
	const secret = 'testsecret';

	const decodedPayload = await verify(accessToken, secret);

	const email = decodedPayload.email;
	const newTbtrValue = Math.floor(Date.now() / 1000);

	await c.env.DB.prepare('UPDATE users SET tbtr = ? WHERE email = ?').bind(newTbtrValue).bind(email).run();
	deleteCookie(c, 'accessToken', {
		path: '/',
		secure: true,
		domain: c.env.SITE_URL,
	});
	deleteCookie(c, 'refreshToken', {
		path: '/',
		secure: true,
		domain: c.env.SITE_URL,
	});

	return c.json('Logged out all sessions');
});

export { logoutAll };
