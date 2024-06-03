import { Hono } from 'hono';
import { initializeLucia } from '../functions/lucia';
import { z } from 'zod';
import { verifyPassword } from '../functions/hashing';
import type { Bindings, UserTable } from '../app';
import { validator } from 'hono/validator';
import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import { decode, sign, verify } from 'hono/jwt';

const userSchema = z.object({
	email: z.string().min(1).email(),
	password: z.string().min(1).max(255),
});
type Variables = JwtVariables;

const login = new Hono<{ Bindings: Bindings; Variables: Variables }>();

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
		// Generate the JWT and send it in a cookie
		// Set signing secret/token
		const secret = '012931n01';
		// JWT Paylod
		const payload = {
			email: user.email,
			emailVerified: user.email_verified,
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Last value of 30 is days (JWT expires in 30 days)
		};

		const token = await sign(payload, secret);

		c.header('Set-Cookie', `jwt=${token}; HttpOnly; Secure; SameSite=Strict`, {
			append: true,
		});

		return c.redirect('/profile');
	},
);



export { login };
