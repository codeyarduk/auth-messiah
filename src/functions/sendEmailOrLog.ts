import type { Bindings } from '../app.d.ts';

const sendEmailOrLog = async (env: Bindings, recipient: string, subject: string, content: string) => {
	const body = {
		personalizations: [
			{
				to: [{ email: recipient }],
				dkim_domain: 'habittra.com',
				dkim_selector: 'mailchannels',
				dkim_private_key: env.DKIM_PRIVATE_KEY,
			},
		],
		from: {
			email: 'info@habittra.com',
			name: 'Habittra',
		},
		subject: subject,
		content: [
			{
				type: 'text/plain',
				value: content,
			},
		],
	};
	if (env.DKIM_PRIVATE_KEY) {
		await fetch('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		});
	} else {
		console.log('Sending email');
		console.log(body);
	}
};

export { sendEmailOrLog };
