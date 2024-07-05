import { setCookie } from 'hono/cookie';
import { generateAccessToken } from './generateAccessToken';
import { generateRefreshToken } from './generateRefreshToken';
import { Context } from 'hono';

export async function setCookies(c: Context, email: string, verified: boolean) {
	// Generating new tokens and setting them as cookies
	const refreshToken = await generateRefreshToken(email, c.env.SECRET_KEY);
	const accessToken = await generateAccessToken(email, verified, c.env.SECRET_KEY);
	console.log('This is the refresh token: ', refreshToken);
	console.log('This is the access token: ', accessToken);
	setCookie(c, 'refreshToken', refreshToken, {
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 30), // Expires in 30 days
		domain: `.${c.env.SITE_URL}`,
		secure: true,
		httpOnly: true,
	});

	setCookie(c, 'accessToken', accessToken, {
		expires: new Date(Date.now() + 15 * 60 * 1000), // Expires in 15 minutes
		domain: `.${c.env.SITE_URL}`,
		secure: true,
		httpOnly: true,
	});
}
