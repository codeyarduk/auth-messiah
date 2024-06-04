import { Hono } from 'hono';
import { initializeLucia } from '../functions/lucia';
import type { Bindings } from '../app.d.ts';
import { Context } from 'hono';
import type { User, Session } from 'lucia';
import { verify } from 'hono/jwt';

const refresh = new Hono<{ Bindings: Bindings; Variables: { user: User | null; session: Session | null } }>();

type SecretKey = string;
type RefreshToken = string;
type DecodedPayload = object;

refresh.post('/', async (c: Context) => {
	const secretKey: SecretKey = 'test-secret';
	const refreshToken: RefreshToken | undefined = c.req.header('refresh-token');

	if (!refreshToken) {
		return c.json(
			{
				loggedIn: false,
				error: {
					message: 'No refresh token provided',
					code: 401,
					description: 'You must include a refresh-token in the request headers to access this resource',
					action: 'Login user to gain a new refresh token',
				},
			},
			401
		);
	}

	const decodedPayload: DecodedPayload = await verify(refreshToken, secretKey);

	if (!decodedPayload) {
		return c.json(
			{
				loggedIn: false,
				error: {
					message: 'Refresh token invalid',
					code: 401,
					description: 'The refresh token provided was not issued by its claimed origin.',
					action: 'Log in user to gain a new refresh token',
				},
			},
			401
		);
	}

	// Logic for creating a new access token should go here
});
