import { Hono } from 'hono';
import { initializeLucia } from '../functions/lucia';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { verifyPassword } from '../functions/hashing';
import type { Bindings, UserTable } from '../app';
import { validator } from 'hono/validator';

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
		const { email, password } = await c.req.valid('form');
		const lucia = initializeLucia(c.env.DB);

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
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		c.header('Set-Cookie', sessionCookie.serialize(), {
			append: true,
		});
		// console.log(sessionCookie);
		// return c.json(`User Verified and logged in ${sessionCookie}`);
		return c.redirect('http://localhost:53844/profile');
	}
);



export { login };
