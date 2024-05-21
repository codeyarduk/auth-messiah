/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import logger from '../middleware/auth';
const app = new Hono();

app.use('/', logger);
app.get('/', (c) => {
	return c.text('Hello Worl!');
});

app.get('/json', (c) => {
	return c.json({ message: 'Hello World!' });
});

export default app;
