import { Hono } from 'hono';

const login = new Hono();

login.get('/login', (c) => {
	return c.json({ message: 'Login success!' });
});

export default login;
