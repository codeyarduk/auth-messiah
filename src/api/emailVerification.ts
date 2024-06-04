import { Hono } from 'hono';
import { verifyVerificationCode } from '../functions/verifyEmailCode';
import { z } from 'zod';
import { validator } from 'hono/validator';
import type { Bindings } from '../app.d.ts';
import type { User, Session } from 'lucia';
import { generateAccessToken } from '../functions/generateAccessToken';
import { generateRefreshToken } from '../functions/generateRefreshToken';

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

		//Set new JWT
		const refreshToken = generateRefreshToken(user.email, true);
		const accessToken = generateAccessToken(user.email);

		c.header('Set-Cookie', `jwt=${refreshToken}; HttpOnly; Secure; SameSite=Strict`, {
			append: true,
		});

		return c.redirect('/');
	},
);

export { verifyEmail };
