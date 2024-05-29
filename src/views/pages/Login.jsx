import { AuthForm } from '../components/AuthForm';
import Layout from '../Layout';

export default function LogIn() {
	return (
		<Layout>
			<div class="flex justify-center">
				<AuthForm action="Log in" description="Enter your email below to login to your account." />
			</div>
		</Layout>
	);
}
