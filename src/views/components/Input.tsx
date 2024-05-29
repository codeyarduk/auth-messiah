type InputProps = {
	label: string;
	name: string;
	placeholder: string;

	type: 'text' | 'textarea' | 'password';
	hasBottomMargin?: boolean;
};

export default function Input({ label, name, placeholder, type, hasBottomMargin = false }: InputProps) {
	return (
		<div class={hasBottomMargin ? 'mb-2' : undefined}>
			{/* <label for={name} class="block mt-4 text-sm font-medium text-gray-900 mb-2">
				{label}
			</label> */}

			<input type={type} name={name} class="text-sm border rounded-lg p-2.5 pl-4 mb-2 w-full" placeholder={placeholder} />
		</div>
	);
}
