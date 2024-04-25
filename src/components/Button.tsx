import type { IconType } from "react-icons/lib";

export const Button = ({
	text,
	icon,
	className,
}: { text: string; icon?: IconType; className?: string }) => {
	return (
		<div>
			<button
				type="submit"
				className={
					className
						? className
						: "bg-green-700 text-white rounded-2xl p-2 w-max text-sm sm:text-base"
				}
			>
				{text}
			</button>
		</div>
	);
};
