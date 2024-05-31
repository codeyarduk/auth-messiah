import { Resend } from 'resend';

const resend = new Resend('re_7pQyzmoh_427vjGkt2TL2WFJSngzsfFjS');

const sendEmailOrLog = async (recipient: string, subject: string, content: string) => {
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
