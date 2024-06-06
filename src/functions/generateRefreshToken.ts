import { sign } from 'hono/jwt';

export async function generateRefreshToken(email: string, secretKey: string) {
	// Generate the JWT and send it in a cookie
	const secret = secretKey;
	const payloadInput = {
		email: email,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
		tbtr: Math.floor(Date.now() / 1000),
	};

	const token = await sign(payloadInput, secret);

	return token;
}
