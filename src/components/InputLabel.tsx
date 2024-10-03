// Input base component that takes name, label, placeholder, required, classNameLabel and classNameInput as props
// (placeholder, classNameLabel and classNameInput are optional)
export const InputLabel = ({
	name,
	type,
	placeholder,
	label,
	required,
	classNameLabel,
	classNameInput,
	value,
	disabled,
}: {
	name: string;
	type: string;
	required: boolean;
	label: string;
	placeholder?: string;
	classNameLabel?: string;
	classNameInput?: string;
	value?: string;
	disabled?: boolean;
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
					type={type}
					name={name}
					id={name}
					required={required}
					className={`${classNameInput} border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full disabled:bg-gray-100`}
					placeholder={placeholder}
					value={value}
					disabled={disabled}
				/>
			</div>
		</>
	);
};
