import { initializeLucia } from '../functions/lucia';
import { getCookie } from 'hono/cookie';
import { Context, Next } from 'hono';

export async function loginCheck(c: Context, next: Next) {
	console.log('Auth Middleware');
	const lucia = initializeLucia(c.env.DB);

	const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
	console.log('Session ID:', sessionId);

	if (!sessionId) {
		c.set('user', null);
		c.set('session', null);
		console.log('No session ID');
		console.log('Cookie:', lucia.sessionCookieName);
		// return c.json('No session ID', 400);
		// c.throw(400, 'No session ID');
		c.status(400);
		return next();
	}

	const { user, session } = await lucia.validateSession(sessionId);
	console.log('User:', user);
	if (session) {
		console.log('Session fresh, and reset');
		c.header('Set-Cookie', lucia.createSessionCookie(sessionId).serialize(), {
			append: true,
		});
		// c.status(200);
		return c.json('User already exists, and has been logged in.', 200);
	}

	if (!session) {
		c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});
		console.log('No session');
		c.status(400);
	}

	console.log('Session:', session);
	c.set('user', user);
	c.set('session', session);
	return next();
}
