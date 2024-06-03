import { LoginForm } from '../components/LoginForm';
import Layout from '../layout';

export default function LogIn({ queryParameters }) {
	return (
		<Layout>
			<div class="flex justify-center">
				<LoginForm action="Log in" queryParameters={queryParameters} />
			</div>
		</Layout>
	);
}
