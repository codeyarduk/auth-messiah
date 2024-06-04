# Auth Messiah
#### User Authentication template for Cloudflare Workers


#### Goals
The end goal for this project is to create an easy to use wrapable auth worker that returns jwt's when used.

This enables the user to clone the repo/worker and self-host auth that is done end-end.

The ideal use would be using iframe's in your project similar to how Auth0 works. 

#### Tech Stack
1. TypeScrpt
2. Cloudflare Workers
3. Hono
4. Lucia Auth 
5. Zod Validator

#### Install Process

coming soon... (I need to take the time to make it reproducable)


#### Database Schema

create table users
(
    id    TEXT not null primary key,
    email TEXT not null unique,
    password TEXT,
    email_verified BOOLEAN DEFAULT false,
    tbtr INTEGER not null,
);
create table email_verification_codes
(
    id    INTEGER not null primary key AUTOINCREMENT,
    email TEXT,
    user_id TEXT unique,
    code TEXT,
    expires_at TEXT
);

_Commands to execute to gen tables_

Users Table

```wrangler d1 execute auth-messiah --command='CREATE TABLE users (id TEXT NOT NULL PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT, email_verified BOOLEAN DEFAULT false, tbtr INTEGER NOT NULL);'```

Email Verification Table

```
wrangler d1 execute auth-messiah --command='CREATE TABLE email_verification_codes (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, email TEXT, user_id TEXT UNIQUE, code TEXT, expires_at TEXT);'
```
