import { Hono } from 'hono';

const publicRoutes = new Hono();

publicRoutes.get('/login', (c) => {
	return c.text('Login Route');
});

publicRoutes.get('/register', (c) => {
	return c.text('Register Route');
});

export { publicRoutes };
