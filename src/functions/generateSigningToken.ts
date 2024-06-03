export default function generateSigningToken() {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	let hexString = '';
	for (let i = 0; i < array.length; i++) {
		hexString += array[i].toString(16).padStart(2, '0');
	}
	return hexString;
}

// create table users
// (
//     id    TEXT not null primary key,
//     email TEXT not null unique,
//     password TEXT
//     email_verified BOOLEAN DEFAULT false
// );

// wrangler d1 execute auth-messiah --command='DROP TABLE IF EXISTS email_verification_codes
// wrangler d1 execute auth-messiah --command='CREATE TABLE email_verification_codes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, email TEXT, user_id TEXT UNIQUE, code TEXT, expires_at TEXT);'

// wrangler d1 execute auth-messiah --command='CREATE TABLE signing_tokens(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, email TEXT, signing_key TEXT);'

