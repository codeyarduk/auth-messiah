import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { authMiddleware } from './middleware/loginCheck';

import { publicRoutes } from './routes/publicRoutes';
import { privateRoutes } from './routes/privateRoutes';
const app = new Hono();

app.use(
	cors({
		origin: 'http://localhost:5173',
		allowHeaders: ['Content-Type', 'X-Custom-Header', 'Upgrade-Insecure-Requests', 'Access-Control-Allow-Origin'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);
app.use(logger());
app.use(csrf());
app.use('/private/*', authMiddleware);
app.use('/*', authMiddleware);

app.route('/', publicRoutes);
app.route('/private', privateRoutes);

export default app;
