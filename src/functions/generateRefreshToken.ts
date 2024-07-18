import { sign } from 'hono/jwt';

export async function generateRefreshToken(uuid: string, secretKey: string) {
	const secret = secretKey;
	const payloadInput = {
		iss: 'authMessiah',
		sub: uuid,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
		iat: Math.floor(Date.now() / 1000),
	};
	const token = await sign(payloadInput, secret);
	return token;
}
