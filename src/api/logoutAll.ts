import { Hono } from 'hono';
import type { Bindings } from '../app.d.ts';
import { verify } from 'hono/jwt';

const logoutAll = new Hono<{ Bindings: Bindings }>();

logoutAll.post('/', async (c) => {
	const accessToken = c.req.header('accessToken');
	const secret = 'testsecret';

	const decodedPayload = await verify(accessToken, secret);

	const email = decodedPayload.email;
	const newTbtrValue = Math.floor(Date.now() / 1000);

	await c.env.DB.prepare('UPDATE users SET tbtr = ? WHERE email = ?').bind(newTbtrValue).bind(email).run();

	c.header('Set-Cookie', 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
	c.header('Set-Cookie', 'accessToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
	return c.json('Logged out all sessions');
});

export { logoutAll };
