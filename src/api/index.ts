import { Hono } from 'hono';

import { register } from './register';
import { login } from './login';
import { logout } from './logout';
import { logoutAll } from './logoutAll';
import { verifyEmail } from './emailVerification';

import { loginCheck } from '../middleware/loginCheck';

const api = new Hono();

api.use('/login', loginCheck);
api.use('/register', loginCheck);

api.route('/register', register);
api.route('/login', login);
api.route('/logout', logout);
api.route('/logout-sessions', logoutAll);
api.route('/verify-email', verifyEmail);

export default api;
