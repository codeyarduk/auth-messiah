import { Hono } from 'hono';
import { z } from 'zod';
import { hashPassword } from '../functions/hashing';
import type { Bindings, UserTable } from '../app.d.ts';
import { validator } from 'hono/validator';
import { generateEmailVerificationCode } from '../functions/generateEmailCode';
import { sendEmailOrLog } from '../functions/sendEmailOrLog';
import { setAccessToken } from '../functions/setAccessToken';
import { setRefreshToken } from '../functions/setRefreshToken';

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
		if (!parsed.success) {
			return c.redirect('/register?content=failed');
		}
		return parsed.data;
	}),

	async (c) => {
		const { email, password } = c.req.valid('form');
		// Checks if the user already exists
		const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserTable>();

		if (user) {
			return c.json('User already exists');
		}

		// Inserts the user into the database if the user does not exist
		const hashResult = await hashPassword(password);

		const userId = crypto.randomUUID();
		const currentDate = Math.floor(Date.now() / 1000); // Note: Add some error handling if all the items taht get entered into the DB aren't correct before being
		await c.env.DB.prepare(`INSERT INTO users (id, email, password, email_verified, tbtr) VALUES (?, ?, ?, ?, ?) returning *`)
			.bind(userId, email, hashResult, false, currentDate)
			.first();

		// Generating new tokens and setting them as cookies
		setAccessToken(c, userId, false);
		setRefreshToken(c, userId);

		// Verification Email
		const key = c.env.RESEND_KEY;
		const verificationCode = await generateEmailVerificationCode(c.env.DB, userId, email);
		console.log('This is the verification code:' + verificationCode);
		await sendEmailOrLog(email, 'Welcome to CodeYard', 'Your verfication code is ' + verificationCode, key);

		// Redirect the user to the email verification page
		return c.redirect('/verify');
	},
);

export { register };
