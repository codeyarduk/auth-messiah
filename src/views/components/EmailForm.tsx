import Button from './Button';
import Input from './Input';

type EmailFormProps = {
	action: 'Verify';
	queryParameters: {
		invalidCode?: string;
		sanitiseFail?: string;
	};
};

export async function EmailForm({ action, queryParameters }: EmailFormProps) {
	const targetUrl = `/api/verify-email}`;
	console.log('TARGET:', targetUrl);
	console.log('QUERY:', queryParameters);

	return (
		<form class="h-screen justify-between flex flex-col py-16" method="POST" action={targetUrl}>
			<div className="w-full flex items-center justify-center">
				<img src="https://i.imgur.com/KLaDLBx.png" width="64" height="64" className="" />
			</div>
			<div>
				<div class="">
					<h1 className="text-[30px] mb-6 text-center font-bold">Verify your email</h1>
				</div>
				<div className="">
					<div className="">
						<Input name="code" placeholder="Code" label="Code" type="text" hasBottomMargin />
					</div>
				</div>
				{queryParameters.invalidCode === 'failed' && <p class="text-red-500 mb-2">Invalid Code</p>}
				{queryParameters.sanitiseFail === 'failed' && <p class="text-red-500 mb-2">Invalid Code</p>}
				<div>
					<Button type="submit" text={action} />
				</div>
			</div>
		</form>
	);
}
