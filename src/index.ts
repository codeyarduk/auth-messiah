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

const api = new Hono();

api.use(
	cors({
		origin: 'http://localhost:5173',
		allowHeaders: ['Content-Type', 'X-Custom-Header', 'Upgrade-Insecure-Requests', 'Access-Control-Allow-Origin'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);
api.use(logger());
api.use(csrf());
api.use(rateLimiterMiddleware);
api.use('/login', loginCheck);
api.use('/register', loginCheck);

api.route('/register', register);
api.route('/login', login);
api.route('/logout', logout);
api.route('/logout-sessions', logoutAll);
api.route('/verify-email', verifyEmail);

export default api;
