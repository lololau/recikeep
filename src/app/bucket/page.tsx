import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import BucketForm from "recikeep/components/pages/Bucket";
import { createServerHelper } from "recikeep/app/api/trpc/[trpc]/route";

export default async function BucketPage() {
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	const helpers = await createServerHelper();
	await helpers.buckets.getBucketsByUserId.prefetch();

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<MaxWidthWrapper>
			<HydrationBoundary state={dehydratedState}>
				<BucketForm />
			</HydrationBoundary>
		</MaxWidthWrapper>
	);
}
