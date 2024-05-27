import { Hono } from 'hono';

const privateRoutes = new Hono();

privateRoutes.get('/dashboard', (c) => {
	return c.json('This is the dashboard page!');
});

privateRoutes.get('/checkLogged', (c) => {
	return c.json('This is the profile page!');
});

export { privateRoutes };
