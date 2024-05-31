import { Hono } from 'hono';
import { verifyVerificationCode } from '../functions/verifyEmailCode';
import { initializeLucia } from '../functions/lucia';
import { z } from 'zod';
import { validator } from 'hono/validator';
import type { Bindings } from '../app.d.ts';
import type { User, Session } from 'lucia';

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
		const user = c.get('user') as any;
		const { code } = c.req.valid('form');
		if (!user) {
			return c.redirect('/verify-email?user=failed');
		}
		const validCode = await verifyVerificationCode(c.env.DB, user, code);
		if (!validCode) {
			return c.redirect('/verify-email?code=failed');
		}

		const lucia = initializeLucia(c.env.DB);
		await lucia.invalidateUserSessions(user.id);
		await c.env.DB.prepare('update users set email_verified = ? where id = ?').bind(true, user.id).run();

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		c.header('Set-Cookie', sessionCookie.serialize(), {
			append: true,
		});
		return c.redirect('/');
	},
);

export { verifyEmail };
