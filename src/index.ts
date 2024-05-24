import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { publicRoutes } from './routes/publicRoutes';
import { privateRoutes } from './routes/privateRoutes';
const app = new Hono();

app.use(logger());
app.use(cors());
app.use(csrf());

app.route('/', publicRoutes);
app.route('/private', privateRoutes);

export default app;
