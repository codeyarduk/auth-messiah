import { Resend } from 'resend';

const sendEmailOrLog = async (recipient: string, subject: string, content: string, key: string) => {
	const resend = new Resend(key);
	const { data, error } = await resend.emails.send({
		from: 'verify@auth.codeyard.co.uk',
		to: recipient,
		subject: subject,
		html: `<div>${content}</div>`,
	});
	if (error) {
		console.log({ error });
	}

	console.log({ data });
};

export { sendEmailOrLog };
