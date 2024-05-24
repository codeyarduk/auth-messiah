import { Hono } from 'hono';

const privateRoutes = new Hono();

privateRoutes.get('/logout', (c) => {
	return c.text('Logout Route');
});

export { privateRoutes };
