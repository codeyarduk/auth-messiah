import { Hono } from 'hono';
import { z } from 'zod';
import { verifyPassword } from '../functions/hashing';
import type { Bindings, UserTable } from '../app';
import { validator } from 'hono/validator';
import { generateRefreshToken } from '../functions/generateRefreshToken';
import { generateAccessToken } from '../functions/generateAccessToken';

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
		// Generate the JWT and send it in a cookie
		// Set signing secret/token

		const refreshToken = generateRefreshToken(email);
		const accessToken = generateAccessToken(email, user.email_verified);

		c.header('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict`, {
			append: true,
		});

		c.header('Set-Cookie', `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict`, {
			append: true,
		});
		return c.redirect('/profile');
	},
);

export { login };
