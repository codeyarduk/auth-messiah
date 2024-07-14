import { sign } from 'hono/jwt';

export async function generateAccessToken(uuid: string, verified: boolean, secretKey: string) {
	const secret = secretKey;
	const payload = {
		iss: 'authMessiah',
		sub: uuid,
		exp: Math.floor(Date.now() / 1000) + 60 * 15,
		iat: Date.now(),
		emailVerified: verified,
	};
	const token = await sign(payload, secret);
	return token;
}
