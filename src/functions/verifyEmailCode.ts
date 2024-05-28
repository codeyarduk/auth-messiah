import { D1Database } from '@cloudflare/workers-types';
import { isWithinExpirationDate } from 'oslo';
import type { User } from 'lucia';
import type { EmailVerificationCode } from '../app.d.ts';

async function verifyVerificationCode(db: D1Database, user: User, code: string) {
	const databaseCode = await db
		.prepare('delete from email_verification_codes where user_id = ? and code = ? and email = ? returning *')
		.bind(user.id, code, user.email)
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
