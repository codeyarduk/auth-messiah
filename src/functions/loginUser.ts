import { generateId } from 'lucia';
import { setCookies } from './setCookies';
export async function loginUser(c, email: string) {
	// Checks if the user already exists and logs in if they do
	const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserTable>();
	if (user) {
		await setCookies(c, email, true);
		return;
	}
	// Continue only if this is a new user
	// Inserts the user into the database if the user does not exist
	// const hashResult = await hashPassword(password);
	const userId = generateId(15);
	await c.env.DB.prepare(`INSERT INTO users (id, email, password, email_verified) VALUES (?, ?, ?, ?) returning *`)
		.bind(userId, email, hashResult, false)
		.first();
	await setCookies(c, email, true);

	return;
}
