import { AuthForm } from '../components/AuthForm';
import Layout from '../layout';

export default function LogIn({ queryParameters }) {
	return (
		<Layout>
			<div class="flex justify-center">
				<AuthForm action="Log in" queryParameters={queryParameters} />
			</div>
		</Layout>
	);
}
