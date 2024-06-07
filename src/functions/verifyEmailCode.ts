import { D1Database } from '@cloudflare/workers-types';
import { isWithinExpirationDate } from 'oslo';
import type { EmailVerificationCode } from '../app.d.ts';

async function verifyVerificationCode(db: D1Database, email: string, code: string) {
	const databaseCode = await db
		.prepare('delete from email_verification_codes where code = ? and email = ? returning *')
		.bind(code, email)
		.first<EmailVerificationCode>();

	if (!databaseCode) {
		return false;
	}

	if (!isWithinExpirationDate(new Date(databaseCode.expires_at))) {
		return false;
	}

	return true;
}

export { verifyVerificationCode };
