import { sign } from 'hono/jwt';

export async function generateAccessToken(email: string, verified: boolean, secretKey: string) {
	const secret = secretKey;
	// JWT Paylod
	const payload = {
		email: email,
		emailVerified: verified,
		exp: Math.floor(Date.now() / 1000) + 60 * 15,
	};

	const token = await sign(payload, secret);

	return token;
}
