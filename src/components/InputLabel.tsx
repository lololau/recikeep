// Input base component that takes name, label, placeholder, required, classNameLabel and classNameInput as props
// (placeholder, classNameLabel and classNameInput are optional)
export const InputLabel = ({
	name,
	placeholder,
	label,
	required,
	classNameLabel,
	classNameInput,
}: {
	name: string;
	required: boolean;
	label: string;
	placeholder?: string;
	classNameLabel?: string;
	classNameInput?: string;
}) => {
	return (
		<>
			<label
				htmlFor={name}
				className={classNameLabel ? classNameLabel : "text-lg"}
			>
				{label}
			</label>
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
