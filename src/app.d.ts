// app.d.ts
/// <reference types="lucia" />

declare namespace Lucia {
	type Auth = import('./functions/lucia.ts').Auth;
	type DatabaseUserAttributes = {};
	type DatabaseSessionAttributes = {};
}
