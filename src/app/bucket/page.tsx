import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import BucketForm from "recikeep/components/pages/Bucket";
import { api, createServerHelper } from "recikeep/trpc/server";

export default async function BucketPage() {
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	const helpers = await createServerHelper();
	await helpers.buckets.getBucketsByUserId.prefetch();

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<BucketForm />
		</HydrationBoundary>
	);
}
