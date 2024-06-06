import { Hono } from 'hono';
import { z } from 'zod';
import { generateId } from 'lucia';
import { hashPassword } from '../functions/hashing';
import type { Bindings, UserTable } from '../app.d.ts';
import { validator } from 'hono/validator';
import { generateEmailVerificationCode } from '../functions/generateEmailCode';
import { sendEmailOrLog } from '../functions/sendEmailOrLog';
import { generateRefreshToken } from '../functions/generateRefreshToken';
import { generateAccessToken } from '../functions/generateAccessToken';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';

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
		try {
			const hashResult = await hashPassword(password);

			const userId = generateId(15);

			await c.env.DB.prepare(`INSERT INTO users (id, email, password, email_verified) VALUES (?, ?, ?, ?) returning *`)
				.bind(userId, email, hashResult, false)
				.first();

			const verificationCode = await generateEmailVerificationCode(c.env.DB, userId, email);
			console.log('This is the verification code:' + verificationCode);

			await sendEmailOrLog(email, 'Welcome to CodeYard', 'Your verfication code is ' + verificationCode);

			const verified = false;
			const refreshToken = await generateRefreshToken(email);
			const accessToken = await generateAccessToken(email, verified);

			console.log('This is the refresh token:' + refreshToken);
			console.log('This is the access token:' + accessToken);
			try {
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
			} catch (err) {
				console.log(err);
			}
			const allCookies = getCookie(c, 'accessToken');

			console.log('all cookies: ' + allCookies);

			return c.redirect('/verify');
		} catch (err) {
			console.log(err);
			return c.json('Error while registering user', 400);
		}
	},
);

export { register };
