export const Button = ({
	text,
	className,
	children,
}: { text?: string; className?: string; children?: React.ReactNode }) => {
	return (
		<div>
			<button
				type="submit"
				className={
					className
						? className
						: "bg-green-700 text-white rounded-md py-1.5 px-2 w-max text-sm sm:text-base"
				}
			>
				<div className="flex flex-row items-center gap-2">
					<div>{text}</div>
					<div>{children}</div>
				</div>
			</button>
		</div>
	);
};
