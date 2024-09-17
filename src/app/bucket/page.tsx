import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import BucketForm from "recikeep/components/pages/Bucket";
import { createServerHelper } from "recikeep/app/api/trpc/[trpc]/route";

export default async function BucketPage() {
	// Validate the user session using the `validateRequest` function.
	// If there is no valid session, redirect the user to the login page.
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	// Create a server-side helper for making tRPC API calls.
	// Prefetch the "buckets" data for the current user.
	const helpers = await createServerHelper();
	await helpers.buckets.getBucketsByUserId.prefetch();

	// Dehydrate the state of the React Query query client which allows us to pass preloaded server data to the client.
	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<MaxWidthWrapper>
			<HydrationBoundary state={dehydratedState}>
				<BucketForm />
			</HydrationBoundary>
		</MaxWidthWrapper>
	);
}
