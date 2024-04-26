export const Input = ({
	name,
	placeholder,
	required,
	classNameInput,
}: {
	name: string;
	required: boolean;
	placeholder?: string;
	classNameInput?: string;
}) => {
	return (
		<>
			<div className="rounded-md shadow-sm border-2 sm:max-w-md">
				<input
					type={name}
					name={name}
					id={name}
					required={required}
					className={`${classNameInput} border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full`}
					placeholder={placeholder}
				/>
			</div>
		</>
	);
};
