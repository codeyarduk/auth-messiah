import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { publicRoutes } from './routes/publicRoutes';
const app = new Hono();

app.use(logger());
app.use(cors());
app.use(csrf());

app.route('/', publicRoutes);

export default app;
