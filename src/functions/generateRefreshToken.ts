import { sign } from 'hono/jwt';

export async function generateRefreshToken(email: string, verified: boolean) {
	// Generate the JWT and send it in a cookie
	const secret = 'testsecret';
	const payloadInput = {
		email: email,
		emailVerified: verified,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
		tbtr: Math.floor(Date.now() / 1000),
	};

	const token = await sign(payloadInput, secret);

	return token;
}
