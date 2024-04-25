"use client";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";

export default function Recipe() {
	return (
		<MaxWidthWrapper>
			<div className="pb-20 mx-auto text-center flex flex-col items-center">
				<div className="py-20 w-full bg-pink-50">
					<h1 className="text-3xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
						Nouvelle recette
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">Oh yeaaaah</p>
				</div>
			</div>
		</MaxWidthWrapper>
	);
}
