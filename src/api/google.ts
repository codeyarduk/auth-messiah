import { Hono } from 'hono';
import { googleAuth } from '@hono/oauth-providers/google';

const google = new Hono();

google.use('/', async (c, next) => {
	const req = googleAuth({
		client_id: c.env.GOOGLE_ID,
		client_secret: c.env.GOOGLE_SECRET,
		scope: ['openid', 'email', 'profile'],
	});
	return req(c, next);
});

google.get('/', (c) => {
	const token = c.get('token');
	const grantedScopes = c.get('granted-scopes');
	const user = c.get('user-google');

	return c.json({
		token,
		grantedScopes,
		user,
	});
});

export { google };
