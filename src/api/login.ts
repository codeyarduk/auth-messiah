import { Hono } from 'hono';
import { z } from 'zod';
import { verifyPassword } from '../functions/hashing';
import type { Bindings, UserTable } from '../app';
import { validator } from 'hono/validator';
import { setCookies } from '../functions/setCookies';

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
		setCookies(c, email, user.email_verified);
		return c.redirect('/profile');
	},
);

export { login };
