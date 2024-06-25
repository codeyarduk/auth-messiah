import { Hono } from 'hono';
import { googleAuth } from '@hono/oauth-providers/google';
import { loginUser } from '../functions/loginUser';
import { deleteCookie } from 'hono/cookie';
import { Bindings } from '../app';
import { Context } from 'hono';

const google = new Hono<{ Context: Context; Bindings: Bindings }>();

google.use('/', async (c, next) => {
	deleteCookie(c, 'state', {
		path: '/',
		domain: 'localhost:8787',
	});
	await next();
});

google.use('/', async (c, next) => {
	const req = googleAuth({
		client_id: c.env.GOOGLE_ID,
		client_secret: c.env.GOOGLE_SECRET,
		scope: ['openid', 'email', 'profile'],
	});
	return req(c, next);
});

google.get('/', (c: Context) => {
	const token = c.get('token');
	const grantedScopes = c.get('granted-scopes');
	const user = c.get('user-google');

	const email = user.email;
	if (!email) {
		return c.text('Error, email is undefinded');
	}
	loginUser(c, email, c.env.DB);

	return c.redirect('/profile', 301);
});

export { google };
