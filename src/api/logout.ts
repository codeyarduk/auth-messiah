import { Hono } from 'hono';
import type { Bindings } from '../app.d.ts';
import { Context } from 'hono';
import type { User, Session } from 'lucia';

const logout = new Hono<{ Bindings: Bindings; Variables: { user: User | null; session: Session | null } }>();

logout.post('/', async (c: Context) => {
	// Clear the JWT cookie
	c.header('Set-Cookie', 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
	c.header('Set-Cookie', 'accessToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
	return c.json('Logged out');
});

export { logout };
