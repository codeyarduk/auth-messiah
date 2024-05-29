import type { FC } from 'hono/jsx';

const Layout: FC = (props) => {
	return (
		<html>
			<body>{props.children}</body>
		</html>
	);
};

const Top: FC<{ messages: string[] }> = (props: { messages: string[] }) => {
	return (
		<Layout>
			<h1>Hello Hono!</h1>
			<ul>
				{props.messages.map((message) => {
					return <li>{message}!!</li>;
				})}
			</ul>
		</Layout>
	);
};

export default Top;
