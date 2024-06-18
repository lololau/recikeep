import { IoMdCloseCircleOutline } from "react-icons/io";

export function Tag({
	tagName,
	onClick,
}: { tagName: string; onClick?: () => void }) {
	return (
		<div className="text-left text-white border border-gray-800 bg-emerald-800 max-w-fit rounded-3xl py-0.5 px-3">
			<p>{tagName}</p>
			{onClick && (
				<p className="font-base text-white text-xs">
					<IoMdCloseCircleOutline />
				</p>
			)}
		</div>
	);
}
