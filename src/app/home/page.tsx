import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { HomePageForm } from "recikeep/components/pages/Home";
import { createServerHelper } from "recikeep/trpc/server";

export default async function HomePage() {
	const { session } = await validateRequest();
	if (!session) {
		redirect("/login");
	}

	const helpers = await createServerHelper();

	await helpers.recipes.getRecipesByUserId.prefetch();

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<MaxWidthWrapper>
			<HydrationBoundary state={dehydratedState}>
				<HomePageForm />
			</HydrationBoundary>
		</MaxWidthWrapper>
	);
}
