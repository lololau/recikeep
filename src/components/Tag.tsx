import { IoMdCloseCircleOutline } from "react-icons/io";

export function Tag({
	tagName,
	bgColor,
	onClick,
	textSize,
	textColor,
}: {
	tagName: string;
	bgColor: string;
	textColor: string;
	onClick?: () => void;
	textSize?: string;
}) {
	return (
		<div
			className={`text-left ${textColor} ${bgColor} min-w-fit rounded-3xl py-0.5 px-3`}
		>
			<p className={`text-${textSize}`}>{tagName}</p>
			{onClick && (
				<p className={`font-base ${textColor} text-xs`}>
					<IoMdCloseCircleOutline />
				</p>
			)}
		</div>
	);
}
