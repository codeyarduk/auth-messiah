// app.d.ts
/// <reference types="lucia" />

declare namespace Lucia {
	type Auth = import('./functions/lucia.ts').Auth;
	type DatabaseUserAttributes = {};
	type DatabaseSessionAttributes = {};
}

export type Bindings = {
	DB: D1Database;
};

export type UserTable = {
	id: string;
	email: string;
	password: string;
	email_verified: boolean;
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
