import Hono from 'hono';
import { setCookie } from 'hono/cookie';
import { GitHub } from 'arctic';
import { generateState } from 'arctic';
import { OAuth2RequestError } from 'arctic';

const github = new Hono();

github.post('/', async (c) => {
	// Create Auth URL
	let redirecturl = c.env.REDIRECT_URL;
	redirecturl ??= 'localhost:8787';

	const state = generateState();

	const url: URL = await github.createAuthorizationURL(state, {
		scopes: ['user:email'],
	});

	setCookie(c, 'state', state, {
		secure: true, // set to false in localhost
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 min
	});
	// return c.redirect(url);

	// Validate Authorization Code
	const code = request.url.searchParams.get('code');
	const state = request.url.searchParams.get('state');

	const storedState = getCookie('state');

	if (!code || !storedState || state !== storedState) {
		// 400
		throw new Error('Invalid request');
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			const { message, description, request } = e;
		}
		// unknown error
	}

	// Refresh Token
	import { OAuth2RequestError } from 'arctic';

	try {
		const tokens = await google.refreshAccessToken(refreshToken);
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			const { request, message, description } = e;
		}
		// unknown error
	}

	// Github Specific
	const giethub = new GitHub(c.env.GITHUB_CLIENT_ID, c.env.GITHUB_CLIENT_SECRET, {
		redirecturl,
		enterpriseDomain,
	});

	const tokens: GitHubTokens = await github.validateAuthorizationCode(code);
});

export { github };
