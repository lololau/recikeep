export const MaxWidthWrapper = ({
	children,
	className,
}: { children: React.ReactNode; className?: string }) => {
	return (
		<div
			className={
				className
					? className
					: "relative mx-auto w-full max-w-screen-xl px-0 md:px-10"
			}
		>
			{children}
		</div>
	);
};
