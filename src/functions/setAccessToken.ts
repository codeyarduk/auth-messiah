import { setCookie } from 'hono/cookie';
import { generateAccessToken } from './generateAccessToken';
import { Context } from 'hono';

export async function setAccessToken(c: Context, uuid: string, verified: boolean) {
	const accessToken = await generateAccessToken(uuid, verified, c.env.SECRET_KEY);
	setCookie(c, 'accessToken', accessToken, {
		path: '/',
		secure: true,
		domain: c.env.SITE_URL,
		httpOnly: true,
		maxAge: 15 * 60,
		expires: new Date(Date.now() + 15 * 60 * 1000),
		sameSite: 'Lax',
	});
}
