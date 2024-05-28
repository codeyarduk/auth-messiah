import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { loginCheck } from './middleware/loginCheck';
import { rateLimiterMiddleware } from './middleware/rateLimiter';

import { register } from './routes/register';
import { login } from './routes/login';
import { logout } from './routes/logout';
import { logoutAll } from './routes/logoutAll';
import { verifyEmail } from './routes/emailVerification';

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
app.use('/register', loginCheck);

app.route('/register', register);
app.route('/login', login);
app.route('/logout', logout);
app.route('/logoutsessions', logoutAll);
app.route('/verify-email', verifyEmail);

export default app;
