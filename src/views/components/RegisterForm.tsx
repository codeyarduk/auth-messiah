import Button from './Button';
import Input from './Input';
import SocialButton from './SocialButton';

type RegisterFormProps = {
	action: 'Register';
	queryParameters: {
		emailOrPasswordFail?: string;
		sanitiseFail?: string;
	};
};

export async function RegisterForm({ action, queryParameters }: RegisterFormProps) {
	const targetUrl = `/api/register`;
	console.log('TARGET:', targetUrl);
	console.log('QUERY:', queryParameters);

	return (
		<div className="h-screen flex flex-col justify-center">
			<form className="" method="POST" action={targetUrl}>
				<div className="w-full flex items-center justify-center">
					<img src="https://i.imgur.com/KLaDLBx.png" width="64" height="64" className="" />
				</div>
				<div>
					<div className="mt-16">
						<h1 className="text-[30px] mb-6 text-center font-bold">Welcome to the team!</h1>
					</div>
					<div className="">
						<div className="flex flex row gap-2">
							<Input name="firstName" placeholder="First Name*" label="First Name" type="text" />
							<Input name="lastName" placeholder="Last Name*" label="Last Name" type="text" />
						</div>
						<div className="">
							<Input name="email" placeholder="Email*" label="Email" type="text" />
						</div>

						<div className="">
							<Input name="password" placeholder="Password*" label="Password" type="password" />
						</div>
						<div className="">
							<Input name="confirmedPassword" placeholder="Confirm password*" label="Password" type="password" hasBottomMargin />
						</div>
					</div>
					{queryParameters.emailOrPasswordFail === 'failed' && <p class="text-red-500 mb-2">Invalid email or password</p>}
					{queryParameters.sanitiseFail === 'failed' && <p class="text-red-500 mb-2">Invalid email or password</p>}
					<div>
						<Button type="submit" text={action} />
					</div>
					<div className="py-5 text-center text-sm mt-2 mb-2">
						<p>
							Have an account?{' '}
							<span className="text-[#27C9A0]  hover:cursor-pointer hover:underline">
								<a href="/login">Login</a>
							</span>
						</p>
					</div>
					<div className="h-[1px] w-full mb-8 bg-slate-200"></div>
				</div>
			</form>
			<form method="POST" action="api/google">
				<SocialButton continueWith="Google" link="/google" />
			</form>

			<form method="POST" action="api/github">
				<SocialButton continueWith="GitHub" link="/github" />
			</form>

			<div className="flex w-full justify-center pt-16">
				<p className="text-sm text-center max-w-[300px]">
					By signing up, you agree to our <span className="text-[#27C9A0]  hover:cursor-pointer hover:underline">Terms of Service</span> and{' '}
					<span className="text-[#27C9A0]  hover:cursor-pointer hover:underline">Privacy Policy</span>
				</p>
			</div>
		</div>
	);
}
