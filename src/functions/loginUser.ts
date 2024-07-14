import type { UserTable } from '../app.d.ts';
import { Context } from 'hono';
import { setAccessToken } from './setAccessToken';
import { setRefreshToken } from './setRefreshToken';

export async function loginUser(c: Context, email: string, db: D1Database) {
	// This function currently is only used for Oauth not for normally loggin in a user
	// Checks if the user already exists and logs in if they do
	try {
		const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserTable>();
		if (user) {
			const uuid = user.uuid;
			const verified = user.email_verified;
			await setAccessToken(c, uuid, verified);
			await setRefreshToken(c, uuid);
			return;
		}
	} catch (err) {
		console.log('failed to get user');
	}
	// Continue only if this is a new user
	// Inserts the user into the database if the user does not exist
	const userId = crypto.randomUUID();
	// User email is verified as they logged in from a supported Oauth provider
	await db.prepare(`INSERT INTO users (id, email, email_verified) VALUES (?, ?, ?) returning *`).bind(userId, email, true).first();
	await setAccessToken(c, userId, true);
	await setRefreshToken(c, userId);

	return;
}
