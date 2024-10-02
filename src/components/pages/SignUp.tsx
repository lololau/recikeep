"use client";

import { UploadButton } from "recikeep/utils/uploadthing";
import Link from "next/link";
import { useFormState } from "react-dom";
import { compressFile } from "recikeep/app/api/uploadthing/core";
import { signUp } from "recikeep/auth/auth_actions";
import { SubmitButton } from "recikeep/components/Button";
import { InputLabel } from "recikeep/components/InputLabel";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "recikeep/trpc/react";
import { IoMdCloseCircle } from "react-icons/io";

export default function SignUpForm() {
	const [state, formAction] = useFormState(signUp, { error: "" });
	const [image, setImage] = useState<string | null>(null);

	const { mutateAsync: deleteImageRecipe } =
		api.recipes.deleteImageRecipeByKey.useMutation({
			onSuccess() {
				setImage(null);
				toast.success("Image supprimée.");
			},
			onError(error) {
				toast.error(error.data?.code);
			},
		});

	return (
		<MaxWidthWrapper>
			<div className="pt-14 w-full text-center px-0">
				<h1 className="text-4xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
					ReciKeep.
				</h1>
				<p className="mt-6 text-lg text-muted-foreground">
					Toutes tes recettes à disposition pour t'inspirer en cuisine.
				</p>
			</div>
			<div className="py-20 mx-auto grid gap-3 items-center max-w-md sm:px-0 px-3">
				<h1 className="text-2xl text-emerald-800 font-gupter font-semibold text-center">
					Créer un compte
				</h1>
				<p className="text-center text-sm">
					Tu as déjà un compte?{" "}
					<Link href="/login" className="underline">
						Connecte-toi
					</Link>
				</p>
				<form action={formAction}>
					<div className="grid gap-2">
						{/* Email */}
						<div className="grid gap-1 py-2">
							<InputLabel
								name="email"
								classNameLabel="sm:text-lg text-base"
								type="email"
								placeholder="you@example.com"
								label="Email *"
								required={true}
							/>
						</div>
						{/* Password */}
						<div className="grid gap-1 py-2">
							<InputLabel
								name="password"
								classNameLabel="sm:text-lg text-base"
								type="password"
								placeholder="*****"
								label="Mot de passe *"
								required={true}
							/>
						</div>
						{/* Confirmation password */}
						<div className="grid gap-1 py-2">
							<InputLabel
								name="password_confirmation"
								classNameLabel="sm:text-lg text-base"
								type="password"
								placeholder="*****"
								label="Confirmation du mot de passe *"
								required={true}
							/>
						</div>
						{/* Pseudo */}
						<div className="grid gap-1 py-2">
							<InputLabel
								name="pseudo"
								classNameLabel="sm:text-lg text-base"
								type="text"
								placeholder="@monpseudo"
								label="Pseudo *"
								required={true}
							/>
						</div>

						{/* IsPublic */}
						<div className="grid gap-1 py-2">
							<label htmlFor="isPublic" className="sm:text-lg text-base">
								Profil public ? *
							</label>
							<div className="flex flex-row">
								<label className="flex px-3 py-2 hover:bg-emerald-800 hover:text-white cursor-pointer ">
									<input type="radio" name="is_public" value={"true"} />
									<p className="pl-2">Oui</p>
								</label>

								<label className="flex px-3 py-2 hover:bg-emerald-800 hover:text-white cursor-pointer ">
									<input type="radio" name="is_public" value={"false"} />
									<p className="pl-2">Non</p>
								</label>
							</div>
						</div>

						<div className="text-center mt-3">
							<SubmitButton text="Créer" />
						</div>
					</div>
					{state.error && (
						<div className="pt-5 text-red-700 font-medium">
							<span>{state.error}</span>
						</div>
					)}
				</form>
			</div>
		</MaxWidthWrapper>
	);
}
