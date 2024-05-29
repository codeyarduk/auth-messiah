type LayoutProps = {
	children: JSX.Element;
	isLoggedIn?: boolean;
};

export default function Layout({ children, isLoggedIn = false }: LayoutProps) {
	return (
		<html>
			<head>
				<script
					src="https://unpkg.com/htmx.org@1.9.10"
					integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
					crossorigin="anonymous"
				/>
				<script src="https://cdn.tailwindcss.com"></script>
				<title>Rabbit Auth</title>
			</head>
			<body class="w-[100%] m-auto justify-center">
				<header></header>
				<main>{children}</main>
			</body>
		</html>
	);
}
