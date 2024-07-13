import { Hono } from 'hono';
import type { Bindings, UserTable } from '../app';
import { verify } from 'hono/jwt';
import { generateAccessToken } from '../functions/generateAccessToken';
import { setCookie } from 'hono/cookie';

const refresh = new Hono<{ Bindings: Bindings; UserTable: UserTable }>();

type SecretKey = string;
type RefreshToken = string;

refresh.post('/', async (c) => {
	const secretKey: SecretKey = 'test-secret';
	const refreshToken: RefreshToken | undefined = c.req.header('refresh-token');

	if (!refreshToken) {
		return c.redirect('/login');
	}

	const decodedPayload = await verify(refreshToken, secretKey);

	if (!decodedPayload) {
		return c.redirect('/login');
	}

	const email = decodedPayload.email;
	// Verify Token
	const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserTable>();

	if (decodedPayload.tbtr < user.tbtr) {
		return c.json({ Response: 'Error Token is invalid' });
	}

	// Logic for creating a new access token should go here

	const accessToken = await generateAccessToken(user.email, user.email_verified, c.env.SECRET_KEY);

	setCookie(c, 'accessToken', accessToken, {
		expires: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
		secure: true,
		httpOnly: true,
	});
	return c.json({ response: 'Access Token Returned' });
});
