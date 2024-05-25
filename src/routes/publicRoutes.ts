import { Hono } from 'hono';
import { initializeLucia } from '../functions/lucia';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../app.d.ts';
import { generateId } from 'lucia';
import { verifyPassword, hashPassword } from '../functions/hashing';

const publicRoutes = new Hono<{ Bindings: Bindings }>();

publicRoutes.post(
	'/login',
	zValidator('json', z.object({ email: z.string().min(1).email(), password: z.string().min(1).max(255) })),
	async (c) => {
		const { email, password } = await c.req.json();
		const lucia = initializeLucia(c.env.DB);

		const user = (await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).run()) as any;
		console.log(user);
		const userId = user.results[0]?.id;
		if (!userId) {
			return c.json('Invalid email or password', 400);
		}
		const validPassword = await verifyPassword(user.results[0].password, password);

		if (!validPassword) {
			return c.json('Invalid email or password', 400);
		}
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		c.header('Set-Cookie', sessionCookie.serialize(), {
			append: true,
		});

		return c.json('User Verified and logged in');
	},
);

publicRoutes.post(
	'/register',
	zValidator('json', z.object({ email: z.string().min(1).email(), password: z.string().min(1).max(255) })),
	async (c) => {
		const lucia = initializeLucia(c.env.DB);

		const { email, password } = await c.req.json();
		// Checks if the user already exists
		const name = (await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).run()) as any;
		console.log(name.results);
		if (name.results.length > 0) {
			console.log('name:', name);
			return c.json('User already exists');
		}
		// Inserts the user into the database if the user does not exist
		try {
			const hashResult = await hashPassword(password);

			const userId = generateId(15);

			const insertedUser = await c.env.DB.prepare(`INSERT INTO users (id, email, password) VALUES (?, ?, ?);`)
				.bind(userId, email, hashResult)
				.run();
			console.log(insertedUser);
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			c.header('Set-Cookie', sessionCookie.serialize(), {
				append: true,
			});

			// return c.json(`This is the email: ${email} This is the password: ${password}`);
			// return c.redirect('/');
			return c.json('User registered successfully');
		} catch (err) {
			console.log(err);
			return c.json('Error while registering user', 400);
		}
	},
);

export { publicRoutes };
