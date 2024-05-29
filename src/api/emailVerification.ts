import { Hono } from 'hono';
import { verifyVerificationCode } from '../functions/verifyEmailCode';
import { initializeLucia } from '../functions/lucia';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../app.d.ts';

const verifyEmail = new Hono<{ Bindings: Bindings }>();
verifyEmail.post(
	'/email-verification',
	zValidator(
		'form',
		z.object({
			code: z.string().min(1),
		})
	),
	async (c) => {
		const user = c.get('user') as any;
		const { code } = c.req.valid('form');
		if (!user) {
			return c.body(null, 400);
		}
		const validCode = await verifyVerificationCode(c.env.DB, user, code);
		if (!validCode) {
			return c.body(null, 400);
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
	}
);

export { verifyEmail };
