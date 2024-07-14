import { Hono } from 'hono';
import type { Bindings, UserTable } from '../app';
import { verify } from 'hono/jwt';
import { setAccessToken } from '../functions/setAccessToken';
import { getCookie } from 'hono/cookie';

const refresh = new Hono<{ Bindings: Bindings; UserTable: UserTable }>();

refresh.post('/', async (c) => {
	const refreshToken = getCookie(c, 'refreshToken');

	if (!refreshToken) {
		return c.redirect('/login');
	}

	const decodedPayload = await verify(refreshToken, c.env.SECRET_KEY);

	if (!decodedPayload || !decodedPayload.iat) {
		return c.redirect('/login');
	}

	const userId = decodedPayload.sub;
	// Verify Token
	const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserTable>();

	if (!user || decodedPayload.iat < user.iat) {
		return c.redirect('/login');
	}
	// Logic for creating a new access token should go here
	setAccessToken(c, user.email, user.email_verified);

	return c.json({ response: 'Access Token Returned' });
});
