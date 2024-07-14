import { setCookie } from 'hono/cookie';
import { generateRefreshToken } from './generateRefreshToken';
import { Context } from 'hono';

export async function setRefreshToken(c: Context, uuid: string) {
	const refreshToken = await generateRefreshToken(uuid, c.env.SECRET_KEY);
	setCookie(c, 'refreshToken', refreshToken, {
		path: '/',
		secure: true,
		httpOnly: true,
		maxAge: 30 * 24 * 60 * 60,
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		sameSite: 'Strict',
	});
}
