import { Hono } from 'hono';
import { verifyVerificationCode } from '../functions/verifyEmailCode';
import { z } from 'zod';
import { validator } from 'hono/validator';
import type { Bindings } from '../app.d.ts';
import { generateAccessToken } from '../functions/generateAccessToken';
import { verify } from 'hono/jwt';

const codeSchema = z.object({
	code: z.string().min(1),
});

const verifyEmail = new Hono<{ Bindings: Bindings }>();

verifyEmail.post(
	'/',
	validator('form', (value, c) => {
		const parsed = codeSchema.safeParse(value);
		if (!parsed.success) {
			return c.redirect('/verify-email?parse=failed');
		}
		return parsed.data;
	}),
	async (c) => {
		const secret = 'testsecret';
		const currentAccessToken = c.req.header('accessToken'); // Might have to adjust how user is accessed and use the email in the JWT

		if (!currentAccessToken) {
			return c.redirect('/verify-email?cookie=failed');
		}

		const decodedPayload = await verify(currentAccessToken, secret);
		console.log(decodedPayload);

		if (!decodedPayload) {
			return c.redirect('/verify-email?signiture=failed');
		}

		const email = decodedPayload.email;

		const { code } = c.req.valid('form');

		const validCode = await verifyVerificationCode(c.env.DB, email, code);
		if (!validCode) {
			return c.redirect('/verify-email?code=failed');
		}

		// Remove current JWT from the browser
		c.header('Set-Cookie', 'jwt=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');

		await c.env.DB.prepare('UPDATE users SET email_verified = ? WHERE email = ?').bind(true, email).run();

		//Set new JWT
		const accessToken = generateAccessToken(email, true);

		c.header('Set-Cookie', `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict`, {
			append: true,
		});

		return c.redirect('/');
	},
);

export { verifyEmail };
