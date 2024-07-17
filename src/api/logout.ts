import { Hono } from 'hono';
import { Context } from 'hono';
import { deleteCookie } from 'hono/cookie';
const logout = new Hono();

logout.post('/', async (c: Context) => {
	// Clear the JWT cookie
	deleteCookie(c, 'refreshToken', {
		path: '/',
		secure: true,
	});
	deleteCookie(c, 'accessToken', {
		path: '/',
		secure: true,
		domain: c.env.SITE_URL,
	});
	return c.redirect('/logged-out');
});

export { logout };
