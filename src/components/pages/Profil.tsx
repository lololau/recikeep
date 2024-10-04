"use client";

import { UploadButton } from "recikeep/utils/uploadthing";
import { compressFile } from "recikeep/app/api/uploadthing/core";
import { InputLabel } from "recikeep/components/InputLabel";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "recikeep/trpc/react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { redirect } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";

type UpdateUserProps = {
	pseudo: string;
	isPublic: string;
};

export default function ProfilForm() {
	const { data: user } = api.auth.getMe.useQuery();
	if (!user) {
		return redirect("/login");
	}

	// User informations
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateUserProps>({
		defaultValues: {
			pseudo: user.pseudo,
			isPublic: user.isPublic.toString(),
		},
	});
	const [image, setImage] = useState<string | null>(
		user?.personalPicture ?? null,
	);

	// Variable to set if we are updating user profil
	const [isDisabled, setIsDisabled] = useState(true);

	// Method to update profil
	const { mutateAsync: updateUser } = api.auth.updateMe.useMutation({
		onSuccess() {
			setIsDisabled(true);
			toast.success("Profil mis à jour!");
		},
		onError(error) {
			toast.error(error.data?.code);
		},
	});

	// Method to delete an image in uploadthing
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

	// Handler call for updating profil
	const onSubmit: SubmitHandler<UpdateUserProps> = async (data) => {
		const valuesToReturn = {
			...data,
			personalPicture: image,
		};

		await updateUser(valuesToReturn);
	};

	return (
		<MaxWidthWrapper>
			<div className="mx-auto text-center flex flex-col items-center">
				<div className="py-14 w-full px-3 flex flex-col gap-2">
					<h1 className="font-gupter font-semibold text-3xl tracking-wide text-gray-800 sm:text-5xl">
						Ton profil
					</h1>
					<button
						type="button"
						onClick={() => setIsDisabled(() => !isDisabled)}
						className="text-sm italic text-emerald-800 sm:text-lg text-muted-foreground"
					>
						Modifier ?
					</button>
				</div>
			</div>
			<div className="mx-auto grid gap-3 items-center max-w-md sm:px-0 px-3">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-2">
						{/* Email */}
						<div className="grid gap-1 py-2">
							<InputLabel
								name="email"
								classNameLabel="text-base"
								type="email"
								placeholder="you@example.com"
								label="Email"
								required={true}
								value={user.email}
								disabled={true}
							/>
						</div>
						{/* Pseudo */}
						<label htmlFor="pseudo" className="text-base font-light">
							Pseudo
						</label>
						<div className="rounded-md shadow-sm border-2 sm:max-w-md">
							<input
								id="pseudo"
								className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full disabled:bg-gray-100"
								placeholder="@monpseudo"
								disabled={isDisabled}
								{...register("pseudo", { required: true })}
							/>
							<p>{errors.pseudo?.message}</p>
						</div>

						{/* IsPublic */}
						<div className="grid gap-1 py-2">
							<label htmlFor="isPublic" className="text-base">
								Profil public
							</label>
							<div className="flex flex-row">
								<label
									className="flex px-3 py-2 cursor-pointer"
									htmlFor="isPublic_true"
								>
									<input
										type="radio"
										value="true"
										{...register("isPublic")}
										disabled={isDisabled}
									/>
									<p className="pl-2 text-sm">Oui</p>
								</label>
								<label
									htmlFor="isPublic_no"
									className="flex px-3 py-2 cursor-pointer"
								>
									<input
										type="radio"
										value="false"
										{...register("isPublic")}
										disabled={isDisabled}
									/>
									<p className="pl-2 text-sm">Non</p>
								</label>
							</div>
						</div>

						{/* Photo */}
						<label htmlFor="main_image" className="">
							Photo de profil
						</label>
						<div className="flex flex-col items-start justify-between gap-3">
							{!isDisabled && (
								<UploadButton
									className="justify-start ut-button:bg-emerald-800 ut-label:text-sm"
									content={{
										button({ ready }) {
											if (ready) return <div>Choisis une photo</div>;

											return "Chargement...";
										},
										allowedContent({ ready, fileTypes, isUploading }) {
											if (!ready) return "...";
											if (isUploading) return "En téléchargement";
											return `Type: ${fileTypes.join(", ")}`;
										},
									}}
									endpoint="imageUploader"
									onBeforeUploadBegin={async (files) => {
										// Compress file before uploading
										const compressedFiles: File[] = [];

										for (let i = 0; i < files.length; i++) {
											const image = files[i];
											const imageCompressed = await compressFile(image);
											compressedFiles.push(imageCompressed);
										}
										return compressedFiles;
									}}
									onClientUploadComplete={(res) => {
										if (image) {
											deleteImageRecipe(image);
										}
										toast.success("Image ajoutée!");
										setImage(res[0].key);
									}}
									onUploadError={(error: Error) => {
										toast.error(`Erreur! ${error.message}`);
									}}
									disabled={isDisabled}
								/>
							)}

							{image?.length ? (
								<div className="flex flex-row gap-2">
									<img
										src={`https://utfs.io/f/${image}`}
										alt=""
										className="w-40 h-auto"
									/>
									{!isDisabled && (
										<button
											type="button"
											className="font-base text-xl"
											onClick={() => {
												deleteImageRecipe(image);
											}}
										>
											<IoClose />
										</button>
									)}
								</div>
							) : null}
						</div>

						{!isDisabled && (
							<div className="text-center pt-5">
								<button type="submit" className="text-xl sm:text-3xl">
									<IoIosCheckmarkCircle color="#065f46" />
								</button>
							</div>
						)}
					</div>
				</form>
			</div>
		</MaxWidthWrapper>
	);
}
