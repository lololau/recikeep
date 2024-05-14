import ReactQuill from "react-quill";
import { IngredientsTable } from "recikeep/components/IngredientsTable";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import QuillRead from "recikeep/components/QuillRead";
import { api } from "recikeep/trpc/server";

export default async function RecipePage({
	params,
}: { params: { recipeId: string } }) {
	const recipe = await api.recipes.getRecipeById(params.recipeId);
	const ingredients = await api.recipes.getIngredientsByRecipeId(
		params.recipeId,
	);
	const tags = await api.recipes.getTagsByRecipeId(params.recipeId);

	if (!recipe) {
		return (
			<MaxWidthWrapper>
				<div className="pb-10 mx-auto text-center flex flex-col items-center">
					<div className="py-20 w-full bg-pink-50">
						<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
							Recette introuvable
						</h1>
						<p className="mt-6 text-lg text-muted-foreground">
							Cette page n'existe pas ou a été supprimée.
						</p>
					</div>
				</div>
			</MaxWidthWrapper>
		);
	}

	return (
		<MaxWidthWrapper>
			<div className="pb-9 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						{recipe.title}
					</h1>
					<div className="flex flex-row justify-center divide-x-2 divide-gray-800 items-center text-lg mt-6 gap-2 text-gray-600">
						<p className="pr-3">Glucides : {recipe.glucides}</p>
						<p className="pl-3">Portions : {recipe.portions}</p>
					</div>
				</div>
			</div>
			{/* <div className="border-t-2 border-dashed pb-9" /> */}
			<div className="flex flex-col gap-10">
				{/* Tag part */}
				{/* {tags.map((tag) => (
					<p key={tag.tagId}>{tag.name}</p>
				))} */}
				<div className="flex flex-col gap-2 ">
					<h1 className=" text-gray-800 text-lg underline underline-offset-4">
						Ingrédients
					</h1>
					<div className="py-4">
						<IngredientsTable ingredients={ingredients} />
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h1 className="text-lg text-gray-800  underline underline-offset-4">
						Étapes de préparation
					</h1>
					{recipe.preparation && <QuillRead text={recipe.preparation} />}
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
