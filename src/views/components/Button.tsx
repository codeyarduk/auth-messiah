type ButtonProps = {
	type: 'submit' | 'button';
	text: string;
};

export default function Button({ type, text }: ButtonProps) {
	return (
		<button
			type={type}
			class="w-full justify-center mt-2 text-white bg-[#27C9A0] hover:bg-emerald-500 active:bg-emerald-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
		>
			{text}
		</button>
	);
}
