import { EmailForm } from '../components/EmailForm';
import Layout from '../layout';

export default function EmailCode({ queryParameters }) {
	return (
		<Layout>
			<div class="flex justify-center">
				<EmailForm action="Verify" queryParameters={queryParameters} />
			</div>
		</Layout>
	);
}
