# Auth Messiah
### User Authentication Worker based on Cloudflare workers

Intended as a plug and play authentication backed that works on cloudflare workers. It is built with typescript and [hono](https://hono.dev)

This can technically be hosted on any provider as [hono](https://hono.dev)is compatible which a large number of runtimes. Some variable conversion will be required for runtimes other than cloudflare workers.
 
### What does it do?

Enables you to host your own authentication without having to roll your own auth. 

Auth Messiah returns 2 simple tokens which you can use in your application. The tokens are a refresh and access token. You can control access to your app by checking for a valid access token on every request. The tokens are in a JWT format. Building an npm package that handles this is in the roadmap.


#### Install Process

This is a rough idea, more specific instructions are in the roadmap.

Github does not natively support private forking of a repo, I made a short guide on how to manually do it [here](private-fork.md)

Summary:

Host it on cloudflare workers, replace all enviroment variables with your enviroment variables. Then setup the databse. Finally integrate it with your app by redirecting all sign up buttons on your website to the corresponding Auth Messian page.

#### Step by step guide
Start by install all pacakges
```
npm install
```
Then login to wrangler
```
npx wrangler login
```
Now create your D1 database
```
npx wrangler d1 create auth-messiah
```
Now deploy your worker, this will create a new worker on cloudflare called auth-messiah
```
npm run deploy
```

Next you need to create the required tables in your database, you can chose to leave these seperate if you want or you can chose to integrate your existing database into here.


_Commands to execute to gen tables_

Users Table

```
npx wrangler d1 execute auth-messiah --command='CREATE TABLE users (id TEXT NOT NULL PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT, email_verified BOOLEAN DEFAULT false, iat INTEGER NOT NULL);'
```

Email Verification Table

```
npx wrangler d1 execute auth-messiah --command='CREATE TABLE email_verification_codes (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, user_id TEXT UNIQUE, code TEXT, expires_at TEXT);'
```

Now repeat both those commands with a --remote at the end of them.

Change all the enviroment variables to your own variables and add those to your cloudflare worker on cloudflares console side. You can add env variables using this command
```
npx wrangler secret put <KEY_NAME>
```
Then it will prompt you to enter the secret 

Then host this on auth.yourdomain.com. 

Auth Messiah will automatically set the JWT cookies for your domain for authentication. Which can be checked on your server side for validaty using (Function coming soon).



#### Database Schema

create table users
(
    id    TEXT not null primary key,
    email TEXT not null unique,
    password TEXT,
    email_verified BOOLEAN DEFAULT false,
    iat INTEGER not null,
);
create table email_verification_codes
(
    id    INTEGER not null primary key AUTOINCREMENT,
    email TEXT not null unique,
    user_id TEXT unique,
    code TEXT,
    expires_at TEXT
);
#### OAuth

Confirm that the Oauth provider that you are using, correctly returns the email address for the user, regardless of user settings. 

For example, Github allows users to set their email to hidden, which means you have to make a specific call to /user/emails instead of /user to get the correct email

#### Enviroment Variables
When working with cloudflare workers your enviroment variables should be kept in a .dev.vars file.

The required enviroment variables for you to set are as follows:

###### Secrets:
- SECRET_KEY=this is the pepper for all jwt's
- RESEND_KEY=for email verfication service
- GOOGLE_ID= 
- GOOGLE_SECRET=
- GITHUB_ID=
- GITHUB_SECRET=

###### Global Vars in wrangler.toml:
- SITE_URL=
- REDIRECT_URL=
