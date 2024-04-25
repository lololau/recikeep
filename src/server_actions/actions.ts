"use server";

export async function createRecipe(_: unknown, formData: FormData) {
	const title = formData.get("title");
	const preparation = formData.get("preparation");
	const portions = formData.get("portions");
	const glucides = formData.get("glucides");
}
