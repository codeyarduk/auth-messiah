import { Hono } from 'hono';
import { googleAuth } from '@hono/oauth-providers/google';
import { loginUser } from '../functions/loginUser';

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

	// Check that email is defined (if not return error and don't generate tokens
	const email = user.email;
	loginUser(c, email);

	return c.redirect('/profile', 301);
});

export { google };
