import { sign } from 'hono/jwt';

export async function generateAccessToken(email: string) {
	const secret = 'testsecret';
	// JWT Paylod
	const payload = {
		email: email,
		emailVerified: true, //Check if this is needed
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
		tbtr: Math.floor(Date.now() / 1000),
	};

	const token = await sign(payload, secret);

	return token;
}
