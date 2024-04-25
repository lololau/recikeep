import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";

export default async function Home() {
	const { session } = await validateRequest();
	if (!session) {
		redirect("/login");
	}

	return (
		<MaxWidthWrapper>
			<div className="pb-20 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
						RECIKEEP.
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						Toutes tes recettes à disposition pour t'inspirer en cuisine.
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-4 mt-10">
					Quelle recette veux-tu cuisiner ?
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
