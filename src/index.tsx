import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { rateLimiterMiddleware } from './middleware/rateLimiter';
import { Context } from 'hono';
// import { loginCheck } from './middleware/loginCheck';

import Login from './views/pages/Login';
import Profile from './views/pages/Profile';
import Register from './views/pages/Register';
import EmailCode from './views/pages/VerifyEmail';

import api from './api';
import { Bindings } from './app';

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
	cors({
		origin: c.env.SITE_URL,
		allowHeaders: ['Content-Type', 'X-Custom-Header', 'Upgrade-Insecure-Requests', 'Access-Control-Allow-Origin'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	});
	console.log(c.env.SITE_URL);
	await next();
});

app.use(logger());
app.use('*', async (c, next) => {
	csrf({ origin: c.env.SITE_URL });
	await next();
});
app.use(rateLimiterMiddleware);
// app.use('/login', loginCheck);

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

app.get('/profile', (c: Context) => {
	return c.html(<Profile />);
});

app.get('/register', (c: Context) => {
	const emailOrPasswordFail = c.req.query('auth');
	const sanitiseFail = c.req.query('content');

	const queryParameters = {
		emailOrPasswordFail: emailOrPasswordFail,
		sanitiseFail: sanitiseFail,
	};

	return c.html(<Register queryParameters={queryParameters} />);
	// return c.json('Register page is not available yet.');
});

app.get('/verify', (c: Context) => {
	const invalidCode = c.req.query('code');
	const sanitiseFail = c.req.query('code');

	const queryParameters = {
		invalidCode: invalidCode,
		sanitiseFail: sanitiseFail,
	};
	return c.html(<EmailCode queryParameters={queryParameters} />);
});

export default app;
