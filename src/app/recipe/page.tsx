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
			<div className="pb-10 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-ecru">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						Nouvelle recette
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">Oh yeah.</p>
				</div>
			</div>
			<NewRecipeForm />
		</MaxWidthWrapper>
	);
}
