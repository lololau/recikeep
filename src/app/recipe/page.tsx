import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import NewRecipeForm from "recikeep/components/pages/NewRecipe";

export default async function NewRecipePage() {
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	return <NewRecipeForm />;
}
