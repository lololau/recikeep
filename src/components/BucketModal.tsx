"use client";

import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FcFlashOn } from "react-icons/fc";
import { IoIosAddCircle, IoIosCheckmarkCircle } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import Modal from "react-modal";
import { api } from "recikeep/trpc/react";
import { toast } from "sonner";
Modal.setAppElement("#root");

// Modal styles
const customStyles = {
	content: {
		top: "15%",
		left: "12%",
		bottom: "auto",
		right: "12%",
	},
};

interface IFormBucket {
	recipeTitle: string;
	source: string;
}

// Modal to register quickly a recipe for adding later with name and source
export function BucketModal() {
	// State to control whether the modal is open or closed
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IFormBucket>();

	// API utilities to perform mutations and refetch queries
	const utils = api.useUtils();

	// Mutation function for creating a new card
	const { mutateAsync, isPending } = api.buckets.createBucket.useMutation({
		onSuccess() {
			toast.success("Recette ajoutée à la liste d'attente");

			// Refetch the buckets list after creating a new bucket
			utils.buckets.getBucketsByUserId.refetch();
			reset();
		},
	});

	function openModal() {
		setIsModalOpen(true);
	}

	function closeModal() {
		setIsModalOpen(false);
	}
	const onSubmit: SubmitHandler<IFormBucket> = async (data) => {
		await mutateAsync(data);
		closeModal();
	};

	return (
		<>
			{/* Button to open the modal */}
			<button
				className="p-3 flex flex-row items-center border border-slate-300 rounded-lg bg-emerald-800 hover:bg-emerald-900 w-full"
				type="button"
				onClick={openModal}
			>
				<div className="px-2 text-start flex-grow">
					<p className="font-base text-white">Quick save</p>
				</div>
				<div className="text-lg">
					<IoIosAddCircle color="white" />
				</div>
			</button>

			{/* Modal component */}
			<div id="modal">
				<Modal
					isOpen={isModalOpen}
					onRequestClose={closeModal}
					style={customStyles}
					shouldCloseOnOverlayClick={true}
				>
					{/* Form for adding a new recipe to the bucket */}
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="pb-10 mx-auto text-center flex flex-col items-center">
							<div className="py-5 w-full bg-rose-100 flex flex-row justify-center items-center gap-1">
								<h1 className="font-gupter text-lg sm:text-xl font-light">
									Enregistre rapidement ta future recette
								</h1>
								<div className="text-2xl">
									<FcFlashOn />
								</div>
							</div>
						</div>
						<div className="grid gap-6">
							{/* Title */}
							<div className="flex flex-col text-gray-800 gap-2 rounded-xl">
								<label htmlFor="recipeTitle" className="font-light">
									Titre
								</label>
								<div className="flex-grow rounded-md shadow-sm border-2">
									<input
										id="recipeTitle"
										aria-invalid={errors.recipeTitle ? "true" : "false"}
										className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
										placeholder="Le titre de ta recette"
										{...register("recipeTitle", { required: true })}
									/>
								</div>
							</div>

							{/* Source */}
							<div className="flex flex-col text-gray-800 gap-2 rounded-xl">
								<label htmlFor="source" className="font-light">
									Source
								</label>
								<div className="flex-grow rounded-md shadow-sm border-2">
									<input
										id="source"
										aria-invalid={errors.source ? "true" : "false"}
										className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
										placeholder="La source"
										{...register("source", { required: true })}
									/>
								</div>
							</div>
							<div className="text-center text-2xl pt-5">
								<button type="submit">
									{isPending && (
										<BiLoaderAlt
											className="animate-spin disabled"
											color="#065f46"
										/>
									)}
									{!isPending && <IoIosCheckmarkCircle color="#065f46" />}
								</button>
							</div>
						</div>
					</form>
				</Modal>
			</div>
		</>
	);
}
