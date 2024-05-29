import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { rateLimiterMiddleware } from './middleware/rateLimiter';
import { Context } from 'hono';
import { loginCheck } from './middleware/loginCheck';

import Login from './views/pages/Login';

import api from './api';

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
app.use(rateLimiterMiddleware);
app.use('/login', loginCheck);

app.route('/api', api);

app.get('/login', (c: Context) => {
	const emailOrPasswordFail = c.req.query('auth');
	const sanitiseFail = c.req.query('content');

	const queryParameters = {
		emailOrPasswordFail: emailOrPasswordFail,
		sanitiseFail: sanitiseFail,
	};

	return c.html(<Login queryParameters={queryParameters} />);
});

export default app;