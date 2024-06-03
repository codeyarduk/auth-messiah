import { RegisterForm } from '../components/RegisterForm';
import Layout from '../layout';

export default function register({ queryParameters }) {
	return (
		<Layout>
			<div class="flex justify-center">
				<RegisterForm action="Register" queryParameters={queryParameters} />
			</div>
		</Layout>
	);
}
