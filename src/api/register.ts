import { Hono } from 'hono';
import { z } from 'zod';
import { initializeLucia } from '../functions/lucia';
import { generateId } from 'lucia';
import { hashPassword } from '../functions/hashing';
import type { Bindings, UserTable } from '../app.d.ts';
import { validator } from 'hono/validator';
import generateSigningToken from '../functions/generateSigningToken';
import { generateEmailVerificationCode } from '../functions/generateEmailCode';
import { sendEmailOrLog } from '../functions/sendEmailOrLog';
import { decode, sign, verify } from 'hono/jwt';

const register = new Hono<{ Bindings: Bindings }>();

const userSchema = z.object({
	firstName: z.string().min(1).max(255),
	lastName: z.string().min(1).max(255),
	email: z.string().min(1).email(),
	password: z.string().min(1).max(255),
	confirmedPassword: z.string().min(1).max(255),
});

register.post(
	'/',
	validator('form', (value, c) => {
		const parsed = userSchema.safeParse(value);
		console.log('hi im the parsed data: ', parsed.error);
		if (!parsed.success) {
			return c.redirect('/register?content=failed');
		}
		return parsed.data;
	}),

	async (c) => {
		const lucia = initializeLucia(c.env.DB);

		const { email, password } = c.req.valid('form');
		// Checks if the user already exists
		const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserTable>();

		console.log(user);
		if (user) {
			console.log('user:', user);
			return c.json('User already exists');
		}
		// Inserts the user into the database if the user does not exist
		try {
			const hashResult = await hashPassword(password);

			const userId = generateId(15);

			const insertedUser = await c.env.DB.prepare(`INSERT INTO users (id, email, password, email_verified) VALUES (?, ?, ?, ?) returning *`)
				.bind(userId, email, hashResult, false)
				.first();
			console.log(insertedUser);

			const verificationCode = await generateEmailVerificationCode(c.env.DB, userId, email);
			console.log('This is the verification code:' + verificationCode);

			await sendEmailOrLog(email, 'Welcome to CodeYard', 'Your verfication code is ' + verificationCode);

			// Generate the JWT and send it in a cookie
			// Set signing secret/token
			const secret = generateSigningToken();

			const insertedToken = await c.env.DB.prepare(`INSERT INTO signing_tokens (id, email, signing_key) VALUES (?, ?, ?) returning *`)
				.bind(userId, email, secret)
				.first();

			console.log(insertedToken);
			// JWT Paylod
			const payload = {
				email: email,
				emailVerified: false,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Last value of 30 is days (JWT expires in 30 days)
			};

			const token = await sign(payload, secret);

			console.log('Setting cookie');
			c.header('Set-Cookie', `jwt=${token}; HttpOnly; Secure; SameSite=Strict`, {
				append: true,
			});
			console.log('Set cookie');

			return c.redirect('/verify');
		} catch (err) {
			console.log(err);
			return c.json('Error while registering user', 400);
		}
	},
);

export { register };
