import Button from './Button';
import Input from './Input';

type AuthFormProps = {
	action: 'Log in' | 'Sign up';
	queryParameters: {
		emailOrPasswordFail?: string;
		sanitiseFail?: string;
	};
};

export async function AuthForm({ action, queryParameters }: AuthFormProps) {
	const targetUrl = `/api/${action === 'Log in' ? 'login' : 'register'}`;
	console.log('TARGET:', targetUrl);
	console.log('QUERY:', queryParameters);

	return (
		<form class="" method="POST" action={targetUrl}>
			<div class="">
				<img src="../../../public/icons/codeyard-logo.svg" />
				<h1 className="text-[30px] mb-6 text-center font-bold">Welcome back!</h1>
			</div>
			<div className="">
				<div className="">
					<Input name="email" placeholder="Email" label="Email" type="text" required />
				</div>

				<div className="">
					<Input name="password" placeholder="Password" label="Password" type="password" hasBottomMargin required />
				</div>
			</div>
			<div>
				<Button type="submit" text={action} />
			</div>
			{queryParameters.emailOrPasswordFail === 'failed' && <p class="text-red-500">Invalid email or password</p>}
			{queryParameters.sanitiseFail === 'failed' && <p class="text-red-500">Invalid email or password</p>}

			<div>
				<p className="text-sm text-center max-w-[300px]">
					By signing up, you agree to our <span className="text-green-600 hover:cursor-pointer hover:underline">Terms of Service</span> and{' '}
					<span className="text-green-600 hover:cursor-pointer hover:underline">Privacy Policy</span>
				</p>
			</div>
		</form>
	);
}
