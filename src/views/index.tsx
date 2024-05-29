import { Hono } from 'hono';
import api from '../index';
const app = new Hono();

app.route('/api', api);

export default app;
