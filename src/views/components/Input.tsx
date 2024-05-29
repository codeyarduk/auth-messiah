type InputProps = {
	label: string;
	name: string;
	placeholder: string;
	required: boolean;
	type: 'text' | 'textarea' | 'password';
	hasBottomMargin?: boolean;
};

export default function Input({ label, name, placeholder, required, type, hasBottomMargin = false }: InputProps) {
	return (
		<div class={hasBottomMargin ? 'mb-6' : undefined}>
			<label for={name} class="block mt-4 text-sm font-medium text-gray-900 mb-2">
				{label}
			</label>

			<input type={type} name={name} class="border rounded-lg p-3 pl-4 mb-2 w-full" placeholder={placeholder} required={required} />
		</div>
	);
}
