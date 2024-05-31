type SocialButtonProps = {
	continueWith: string;
};

export default function SocialButton({ continueWith }: SocialButtonProps) {
	return (
		<button class="border w-full justify-center mt-2 hover:bg-gray-50 active:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
			Continue with {continueWith}
		</button>
	);
}
