import { Hono } from 'hono';
import { githubAuth } from '@hono/oauth-providers/github';
import { Bindings } from '../app';
import { loginUser } from '../functions/loginUser';

const github = new Hono<{ Bindings: Bindings }>();

github.use('/', async (c, next) => {
	const req = githubAuth({
		client_id: c.env.GITHUB_ID,
		client_secret: c.env.GITHUB_SECRET,
		scope: ['public_repo', 'read:user', 'user', 'user:email', 'user:follow'],
		oauthApp: true,
	});
	return req(c, next);
});

github.get('/', (c) => {
	const token = c.get('token');
	const refreshToken = c.get('refresh-token');
	const user = c.get('user-github');

	const email = user.email;
	if (!email) {
		return c.text('Error, email is undefinded');
	}
	loginUser(c, email, c.env.DB);

	return c.redirect('/profile', 301);
});

export { github };
