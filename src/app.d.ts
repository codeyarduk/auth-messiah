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
