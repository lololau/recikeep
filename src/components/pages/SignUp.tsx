"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { PiCookingPotFill } from "react-icons/pi";
import { signUp } from "recikeep/auth/auth_actions";
import { SubmitButton } from "recikeep/components/Button";
import { InputLabel } from "recikeep/components/InputLabel";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";

export default function SignUpForm() {
	const [state, formAction] = useFormState(signUp, { error: "" });

	return (
		<MaxWidthWrapper>
			<div className="pt-14 w-full text-center px-0">
				<h1 className="text-4xl font-semibold tracking-wide text-gray-800 sm:text-6xl">
					RECIKEEP.
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
						<div className="grid gap-1 py-2">
							<InputLabel
								name="email"
								type="email"
								placeholder="you@example.com"
								label="Email"
								required={true}
							/>
						</div>
						<div className="grid gap-1 py-2">
							<InputLabel
								name="password"
								type="password"
								placeholder="*****"
								label="Mot de passe"
								required={true}
							/>
						</div>
						<div className="grid gap-1 py-2">
							<InputLabel
								name="password_confirmation"
								type="password"
								placeholder="*****"
								label="Confirmation du mot de passe"
								required={true}
							/>
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
