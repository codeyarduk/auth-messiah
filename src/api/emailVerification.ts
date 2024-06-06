import { Hono } from 'hono';
import { verifyVerificationCode } from '../functions/verifyEmailCode';
import { z } from 'zod';
import { validator } from 'hono/validator';
import type { Bindings } from '../app.d.ts';
import { generateAccessToken } from '../functions/generateAccessToken';
import { verify } from 'hono/jwt';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

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
		const currentAccessToken = getCookie(c, 'accessToken');
		console.log(currentAccessToken);

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

		await c.env.DB.prepare('UPDATE users SET email_verified = ? WHERE email = ?').bind(true, email).run();

		//Set new JWT
		const accessToken = await generateAccessToken(email, true);

		deleteCookie(c, 'accessToken', {
			path: '/',
			secure: true,
			domain: c.env.SITE_URL,
		});
		setCookie(c, 'accessToken', accessToken, {
			expires: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
			secure: true,
			httpOnly: true,
		});

		return c.redirect('/');
	},
);

export { verifyEmail };
