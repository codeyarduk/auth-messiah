import { generateId } from 'lucia';
import { setCookies } from './setCookies';
import type { Bindings, UserTable } from '../app.d.ts';
export async function loginUser(c: Bindings, email: string, db: D1Database) {
	console.log('starting login user function');
	// Checks if the user already exists and logs in if they do
	try {
		const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserTable>();
		if (user) {
			console.log('user');
			console.log('setting cookie as user already exists');
			await setCookies(c, email, true);
			return;
		}
	} catch (err) {
		console.log('failed to get user');
	}
	// Continue only if this is a new user
	// Inserts the user into the database if the user does not exist
	// const hashResult = await hashPassword(password);
	console.log('creating new user becaues no user exists');
	const userId = generateId(15);
	await db.prepare(`INSERT INTO users (id, email, email_verified) VALUES (?, ?, ?) returning *`).bind(userId, email, false).first();
	console.log('setting the cookie now');
	await setCookies(c, email, true);

	return;
}
