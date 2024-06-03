import { Hono } from 'hono';
import { verifyVerificationCode } from '../functions/verifyEmailCode';
import { initializeLucia } from '../functions/lucia';
import { z } from 'zod';
import { validator } from 'hono/validator';
import type { Bindings } from '../app.d.ts';
import type { User, Session } from 'lucia';
import { decode, sign, verify } from 'hono/jwt';

const codeSchema = z.object({
	code: z.string().min(1),
});

const verifyEmail = new Hono<{ Bindings: Bindings; Variables: { user: User | null; session: Session | null } }>();

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
		const user = c.get('user') as any; // Might have to adjust how user is accessed and use the email in the JWT
		const { code } = c.req.valid('form');
		console.log('This is the user:' + user);
		if (!user) {
			return c.redirect('/verify-email?user=failed');
		}
		const validCode = await verifyVerificationCode(c.env.DB, user, code);
		if (!validCode) {
			return c.redirect('/verify-email?code=failed');
		}

		// Remove current JWT from the browser
		c.header('Set-Cookie', 'jwt=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');

		await c.env.DB.prepare('update users set email_verified = ? where id = ?').bind(true, user.id).run();
		//Set JWT
		const secret = '012931n01';
		// JWT Paylod
		const payload = {
			email: user.email,
			emailVerified: user.email_verified, // Note!!! For this route this might have to be manually set to true (untested)
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Last value of 30 is days (JWT expires in 30 days)
		};

		const token = await sign(payload, secret);

		c.header('Set-Cookie', `jwt=${token}; HttpOnly; Secure; SameSite=Strict`, {
			append: true,
		});

		return c.redirect('/');
	},
);

export { verifyEmail };
