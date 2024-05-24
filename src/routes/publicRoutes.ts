import { Hono } from 'hono';

const publicRoutes = new Hono();

publicRoutes.get('/login', (c) => {
	return c.text('Login Route');
});

export { publicRoutes };
