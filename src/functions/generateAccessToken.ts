import { sign } from 'hono/jwt';

export async function generateAccessToken(email: string, verified: boolean) {
	const secret = 'testsecret';
	// JWT Paylod
	const payload = {
		email: email,
		emailVerified: verified,
		exp: Math.floor(Date.now() / 1000) + 60 * 15,
	};

	const token = await sign(payload, secret);

	return token;
}
