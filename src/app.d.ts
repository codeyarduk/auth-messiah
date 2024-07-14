// app.d.ts
export type Bindings = {
	DB: D1Database;
	DKIM_PRIVATE_KEY?: string;
	RESEND_KEY: string;
	SITE_URL: string;
	REDIRECT_URL: string;
	SECRET_KEY: string;
};

export type UserTable = {
	id: string;
	email: string;
	password: string;
	email_verified: boolean;
	iat: number;
};

export type EmailVerificationCode = {
	id: number;
	code: string;
	email: string;
	expires_at: string;
};

export interface DatabaseUserAttributes {
	email: string;
	email_verified: boolean;
}
