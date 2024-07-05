type SocialButtonProps = {
	continueWith: string;
	link: string;
};

export default function SocialButton({ continueWith, link }: SocialButtonProps) {
	return (
		<button
			class="border w-full justify-center mt-2 hover:bg-gray-50 active:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
			href={link}
		>
			Continue with {continueWith}
		</button>
	);
}
