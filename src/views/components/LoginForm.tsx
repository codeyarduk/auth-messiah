import Button from './Button';
import Input from './Input';
import SocialButton from './SocialButton';

type LoginFormProps = {
	action: 'Log in' | 'Sign up';
	queryParameters: {
		emailOrPasswordFail?: string;
		sanitiseFail?: string;
	};
};

export async function LoginForm({ action, queryParameters }: LoginFormProps) {
	const targetUrl = `/api/${action === 'Log in' ? 'login' : 'register'}`;
	console.log('TARGET:', targetUrl);
	console.log('QUERY:', queryParameters);

	return (
		<form class="h-screen justify-between flex flex-col py-16" method="POST" action={targetUrl}>
			<div className="w-full flex items-center justify-center">
				<img src="https://i.imgur.com/KLaDLBx.png" width="64" height="64" className="" />
			</div>
			<div>
				<div class="">
					<h1 className="text-[30px] mb-6 text-center font-bold">Welcome back!</h1>
				</div>
				<div className="">
					<div className="">
						<Input name="email" placeholder="Email" label="Email" type="text" />
					</div>

					<div className="">
						<Input name="password" placeholder="Password" label="Password" type="password" hasBottomMargin />
					</div>
				</div>
				{queryParameters.emailOrPasswordFail === 'failed' && <p class="text-red-500 mb-2">Invalid email or password</p>}
				{queryParameters.sanitiseFail === 'failed' && <p class="text-red-500 mb-2">Invalid email or password</p>}
				<div>
					<Button type="submit" text={action} />
				</div>
				<div className="py-5 text-center text-sm mt-2 mb-2">
					<p>
						Don't have an account?{' '}
						<span className="text-[#27C9A0]  hover:cursor-pointer hover:underline">
							<a href="/register">Sign up</a>
						</span>
					</p>
				</div>
				<div className="h-[1px] w-full mb-8 bg-slate-200"></div>
				<SocialButton continueWith="Google" />
				<SocialButton continueWith="Apple" />
			</div>

			<div className="flex w-full justify-center">
				<p className="text-sm text-center max-w-[300px]">
					By signing up, you agree to our <span className="text-[#27C9A0]  hover:cursor-pointer hover:underline">Terms of Service</span> and{' '}
					<span className="text-[#27C9A0]  hover:cursor-pointer hover:underline">Privacy Policy</span>
				</p>
			</div>
		</form>
	);
}
