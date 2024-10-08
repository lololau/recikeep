import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { HomePageForm } from "recikeep/components/pages/Home";
import { createServerHelper } from "recikeep/app/api/trpc/[trpc]/route";

function timeoutPromise(ms: number, promise: Promise<void>) {
	const timeout = new Promise((resolve, reject) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			reject(new Error(`Timed out in ${ms}ms.`));
		}, ms);
	});

	return Promise.race([promise, timeout]);
}

export default async function HomePage() {
	const { session } = await validateRequest();
	if (!session) {
		console.log("redirect login");
		redirect("/login");
	}

	// This helper will be used to prefetch data for the homepage.
	const helpers = await createServerHelper();

	// Prefetch the list of recipes for the current user to improve loading time on the client side.

	console.log("getMe - prefetch");
	await helpers.auth.getMe.prefetch();

	console.log("getRecipesByUserId - prefetch");
	const getRecipesPromise = helpers.recipes.getRecipesByUserId.prefetch();
	timeoutPromise(5000, getRecipesPromise)
		.then(() => {
			console.log("success getRecipesByUserId");
		})
		.catch((e) => {
			console.log(e.stack);
			console.error(e); // Print the stack trace
		});

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<MaxWidthWrapper>
			<HydrationBoundary state={dehydratedState}>
				<HomePageForm />
			</HydrationBoundary>
		</MaxWidthWrapper>
	);
}
