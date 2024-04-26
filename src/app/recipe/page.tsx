"use client";

import { IoIosAddCircle } from "react-icons/io";

import { Button } from "recikeep/components/Button";
import { IngredientsTable } from "recikeep/components/IngredientsTable";
import { Input } from "recikeep/components/Input";
import { InputLabel } from "recikeep/components/InputLabel";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";

export default function Recipe() {
	return (
		<MaxWidthWrapper>
			<div className="pb-10 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl tracking-wide text-gray-800 sm:text-6xl">
						Nouvelle recette
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">Oh yeah.</p>
				</div>
			</div>
			<div>
				<form>
					<div className="grid grid-cols-2">
						<div className="grid gap-2">
							{/* === Title === */}
							<div className="grid gap-1 py-2">
								<InputLabel
									name="title"
									placeholder="Ton titre"
									label="Titre"
									required={true}
									classNameLabel="text-base font-semibold"
								/>
							</div>

							{/* === Preparation details === */}
							<div className="grid gap-1 py-2">
								<label
									htmlFor="preparation"
									className="text-base font-semibold"
								>
									Préparation
								</label>
								<div className="rounded-md shadow-sm border-2 sm:max-w-md">
									<textarea
										name="preparation"
										id="preparation"
										className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
										placeholder="Décris les étapes de ta recette"
									/>
								</div>
							</div>

							{/* === Portions quantity === */}
							<div className="grid gap-1 py-2">
								<InputLabel
									name="portions"
									placeholder="2"
									label="Nombre de portions"
									required={true}
									classNameLabel="text-base font-semibold"
								/>
							</div>

							{/* === Glucides === */}
							<div className="grid gap-1 py-2">
								<InputLabel
									name="glucides"
									placeholder="30g"
									label="Total des glucides du plat"
									required={false}
									classNameLabel="text-base font-semibold"
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<div className="gap-1 py-2">
								<p className="font-semibold pb-1">Ingrédients</p>
								<div className="flex flex-row items-center gap-2">
									<Input
										placeholder="Quel ingrédient ?"
										name="ingredient"
										required={false}
									/>
									<Input
										placeholder="Quelle quantité ?"
										name="quantity"
										required={false}
									/>
									<button type="button">
										<IoIosAddCircle color="green" size="25px" />
									</button>
								</div>
								{/* <IngredientsTable /> */}
							</div>
							<div className="gap-1 py-2">
								<p className="font-semibold pb-1">Tags</p>
								<div className="flex flex-row items-center gap-2">
									<Input placeholder="Quel tag ?" name="tag" required={false} />
									<button type="button">
										<IoIosAddCircle color="green" size="25px" />
									</button>
								</div>
								{/* <TagsTable /> */}
							</div>
						</div>
					</div>
					<div className="text-center mt-3">
						<Button text="Valider la recette" />
					</div>
				</form>
			</div>
		</MaxWidthWrapper>
	);
}
