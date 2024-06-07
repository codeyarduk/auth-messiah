import { Hono } from 'hono';
import { Context, Next } from 'hono';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
	points: 20, // 20 requests
	duration: 1, // per 1 second by IP
});
// export async function
export async function rateLimiterMiddleware(c: Context, next: Next) {
	try {
		await rateLimiter.consume(c.env.ip);
		await next();
	} catch (rejRes) {
		return c.json('Too many requests', 429);
	}
}
