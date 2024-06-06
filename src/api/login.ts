import { Hono } from 'hono';
import { z } from 'zod';
import { verifyPassword } from '../functions/hashing';
import type { Bindings, UserTable } from '../app';
import { validator } from 'hono/validator';
import { generateRefreshToken } from '../functions/generateRefreshToken';
import { generateAccessToken } from '../functions/generateAccessToken';
import { setCookie, deleteCookie } from 'hono/cookie';

const userSchema = z.object({
	email: z.string().min(1).email(),
	password: z.string().min(1).max(255),
});

const login = new Hono<{ Bindings: Bindings }>();

login.post(
	'/',
	validator('form', (value, c) => {
		const parsed = userSchema.safeParse(value);
		if (!parsed.success) {
			return c.redirect('/login?content=failed');
		}
		return parsed.data;
	}),
	async (c) => {
		const { email, password } = c.req.valid('form');

		const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserTable>();
		console.log(user);
		const userId = user?.id;
		if (!userId) {
			// return c.json('Invalid email or password', 400);
			return c.redirect('/login?auth=failed');
		}
		const validPassword = await verifyPassword(user.password, password);

		if (!validPassword) {
			// return c.json('Invalid email or password', 400);
			return c.redirect('/login?auth=failed');
		}

		// Delete old cookies
		deleteCookie(c, 'accessToken', {
			path: '/',
			secure: true,
			domain: 'localhost:8787',
		});
		deleteCookie(c, 'refreshToken', {
			path: '/',
			secure: true,
			domain: 'localhost:8787',
		});

		// Generate the JWT and send it in a cookie
		const refreshToken = await generateRefreshToken(email);
		const accessToken = await generateAccessToken(email, user.email_verified);

		setCookie(c, 'refreshToken', refreshToken, {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 30), // Expires in 30 days
			secure: true,
			httpOnly: true,
		});

		setCookie(c, 'accessToken', accessToken, {
			expires: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
			secure: true,
			httpOnly: true,
		});
		return c.redirect('/profile');
	},
);

export { login };
