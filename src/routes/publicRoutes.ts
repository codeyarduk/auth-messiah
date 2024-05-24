import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const publicRoutes = new Hono();

publicRoutes.get('/login', (c) => {
	return c.text('Login Route');
});

publicRoutes.post(
	'/register',
	zValidator('json', z.object({ email: z.string().min(1).email(), password: z.string().min(1).max(255) })),
	async (c) => {
		const validated = await c.req.json();
		return c.json(`This is the email: ${validated.email} /n/n This is the password: ${validated.password}`);
	},
);

export { publicRoutes };
