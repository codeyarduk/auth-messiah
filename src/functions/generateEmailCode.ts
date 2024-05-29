import { D1Database } from '@cloudflare/workers-types';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';

async function generateEmailVerificationCode(db: D1Database, userId: string, email: string) {
	console.log('Deleting old email codes');
	await db.prepare('delete from email_verification_codes where user_id = ?').bind(userId).run();
	console.log('Old code deleted');
	const code = generateRandomString(8, alphabet('0-9'));

	console.log('inserting new code');
	await db
		.prepare('insert into email_verification_codes (user_id, email, code, expires_at) values (?,?,?,?)')
		.bind(userId, email, code, createDate(new TimeSpan(15, 'm')).toString())
		.run();
	return code;
}

export { generateEmailVerificationCode };
