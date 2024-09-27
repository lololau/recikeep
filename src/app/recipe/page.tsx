import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import NewRecipeForm from "recikeep/components/pages/NewRecipe";

export default async function NewRecipePage() {
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	return (
		<MaxWidthWrapper>
			<div className="bg-white z-20 sm:pb-0 pb-14">
				<div className="mx-auto text-center flex flex-col items-center">
					<div className="py-14 w-full px-3 flex flex-col gap-2">
						<h1 className="font-gupter font-semibold text-3xl tracking-wide text-gray-800 sm:text-5xl">
							Nouvelle recette
						</h1>
						<p className="text-sm italic text-emerald-800 sm:text-lg text-muted-foreground">
							Oh yeah.
						</p>
					</div>
				</div>
				<NewRecipeForm />
			</div>
		</MaxWidthWrapper>
	);
}
