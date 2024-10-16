"use client";

// Card component with recipeTitle, source and onClick function as props
import { MdDeleteOutline } from "react-icons/md";
import { api } from "recikeep/trpc/react";
import { toast } from "sonner";

export function BucketCard({
	recipeTitle,
	source,
	bucketId,
	onClick,
}: {
	recipeTitle: string;
	source: string;
	bucketId: string;
	onClick: () => void;
}) {
	const utils = api.useUtils();

	const { mutateAsync: deleteBucket } =
		api.buckets.deleteBucketById.useMutation({
			onSuccess() {
				toast.success("Carte supprimée du backlog");

				// Refetch the buckets list after having deleted one
				utils.buckets.getBucketsByUserId.refetch();
			},
		});

	const onDeleteHandler = (bucketId: string) => {
		if (
			window.confirm(
				"Êtes vous sûr de vouloir supprimer cette carte? Action irréversible.",
			)
		) {
			deleteBucket(bucketId);
		}
	};

	return (
		<div className="flex flex-row justify-between">
			<button type="button" onClick={onClick} className="flex flex-grow">
				<div className="text-left font-light text-gray-800">
					<p>{recipeTitle}</p>
					<p className="text-left font-base text-gray-500 text-xs ">
						Reference: {source}
					</p>
				</div>
			</button>

			<button type="button" onClick={() => onDeleteHandler(bucketId)}>
				<MdDeleteOutline />
			</button>
		</div>
	);
}
