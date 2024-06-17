import Hono from 'hono'
import { setCookie } from 'hono/cookie';
import { GitHub } from "arctic";
import { generateState } from "arctic";

const github = new Hono();

github.post('/',
	async (c) => {

	const github = new GitHub(clientId, clientSecret, {
		redirectURI,
		enterpriseDomain: 
	})
	
	const url: URL = await github.createAuthorizationURL(state, {
		scopes
	})
	setCookie("state", state, {
		secure: true, // set to false in localhost
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10 // 10 min
	});
	return redirect(url)
	
	const tokens: GitHubTokens = await github.validateAuthorizationCode(code)
}
)

export { github }
