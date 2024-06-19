import { IoMdCloseCircleOutline } from "react-icons/io";

export function Tag({
	tagName,
	onClick,
}: { tagName: string; onClick?: () => void }) {
	return (
		<div className="text-left text-white bg-emerald-800 min-w-fit rounded-3xl py-0.5 px-3">
			<p>{tagName}</p>
			{onClick && (
				<p className="font-base text-white text-xs">
					<IoMdCloseCircleOutline />
				</p>
			)}
		</div>
	);
}
