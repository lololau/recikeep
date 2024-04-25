export const MaxWidthWrapper = ({
	children,
	className,
}: { children: React.ReactNode; className?: string }) => {
	return (
		<div
			className={
				className ? className : "mx-auto w-full max-w-screen-xl px-2.5 md:px-20"
			}
		>
			{children}
		</div>
	);
};
