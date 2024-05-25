import { Hono } from 'hono';
import { initializeLucia } from '../functions/lucia';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Bindings } from '../app.d.ts';

const publicRoutes = new Hono<{ Bindings: Bindings }>();

publicRoutes.get('/login', (c) => {
	return c.text('Login Route');
});

publicRoutes.post(
	'/register',
	zValidator('json', z.object({ email: z.string().min(1).email(), password: z.string().min(1).max(255) })),
	async (c) => {
		const lucia = initializeLucia(c.env.DB);
		const { email, password } = await c.req.json();

		//unknown insert into table
		await lucia.table('user').insert({});

		return c.json(`This is the email: ${email} /n/n This is the password: ${password}`);
	},
);

export { publicRoutes };
