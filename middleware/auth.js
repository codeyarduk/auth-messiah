import { createMiddleware } from 'hono/factory';

const logger = createMiddleware(async (c, next) => {
	console.log(`[${c.req.method}] ${c.req.url} LOADED MIDDLEWARE`);
	await next();
});

export default logger;
