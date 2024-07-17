import { Hono } from 'hono';
import { verifyVerificationCode } from '../functions/verifyEmailCode';
import { z } from 'zod';
import { validator } from 'hono/validator';
import type { Bindings } from '../app.d.ts';
import { generateAccessToken } from '../functions/generateAccessToken';
import { verify } from 'hono/jwt';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { setAccessToken } from '../functions/setAccessToken';

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
		const secret = c.env.SECRET_KEY;
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
		const result = await c.env.DB.prepare('SELECT USERID FROM users WHERE email = ?').bind(email).first();
		const userId = result.id;

		//Set new JWT
		deleteCookie(c, 'accessToken', {
			path: '/',
			secure: true,
			domain: c.env.SITE_URL,
		});
		setAccessToken(c, userId, true);
		console.log('Redirect URL: ' + c.env.REDIRECT_URL + 'SITEURL: ' + c.env.SITE_URL);
		return c.redirect(c.env.REDIRECT_URL);
	},
);

export { verifyEmail };
