import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { HomePageForm } from "recikeep/components/pages/Home";
import { createServerHelper } from "recikeep/app/api/trpc/[trpc]/route";

export default async function HomePage() {
	const { session } = await validateRequest();
	if (!session) {
		redirect("/login");
	}

	// This helper will be used to prefetch data for the homepage.
	const helpers = await createServerHelper();

	// Prefetch the list of recipes for the current user to improve loading time on the client side.
	await helpers.recipes.getRecipesByUserId.prefetch();
	await helpers.auth.getMe.prefetch();

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<MaxWidthWrapper>
			<HydrationBoundary state={dehydratedState}>
				<HomePageForm />
			</HydrationBoundary>
		</MaxWidthWrapper>
	);
}
