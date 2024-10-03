import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import ProfilForm from "recikeep/components/pages/Profil";
import { createServerHelper } from "../api/trpc/[trpc]/route";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function ProfilPage() {
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	const helpers = await createServerHelper();
	await helpers.auth.getMe.prefetch();

	const dehydratedState = dehydrate(helpers.queryClient);

	return (
		<MaxWidthWrapper>
			<div className="bg-white z-20 sm:pb-0 pb-14">
				<HydrationBoundary state={dehydratedState}>
					<ProfilForm />
				</HydrationBoundary>
			</div>
		</MaxWidthWrapper>
	);
}
