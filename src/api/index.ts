import { Hono } from 'hono';

import { register } from './register';
import { login } from './login';
import { logout } from './logout';
import { logoutAll } from './logoutAll';
import { verifyEmail } from './emailVerification';
import { google } from './google';
import { refresh } from './refresh';

// import { loginCheck } from '../middleware/loginCheck';

const api = new Hono();

// api.use('/login', loginCheck);
// api.use('/register', loginCheck);
// api.use('/verify-email', loginCheck);

api.route('/refresh', refresh);
api.route('/register', register);
api.route('/login', login);
api.route('/logout', logout);
api.route('/logout-sessions', logoutAll);
api.route('/verify-email', verifyEmail);
api.route('/google', google);

export default api;
