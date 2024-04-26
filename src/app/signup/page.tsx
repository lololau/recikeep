"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { PiCookingPotFill } from "react-icons/pi";
import { signUp } from "recikeep/auth/auth_actions";
import { Button } from "recikeep/components/Button";
import { InputLabel } from "recikeep/components/InputLabel";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";

export default async function SignUpPage() {
	const [state, formAction] = useFormState(signUp, { error: "" });

	return (
		<MaxWidthWrapper>
			<div className="py-20 mx-auto grid gap-3 items-center max-w-md">
				<PiCookingPotFill className="h-10 w-10 justify-self-center" />
				<h1 className="text-2xl font-semibold text-center">Créer un compte</h1>
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
								placeholder="you@example.com"
								label="Email"
								required={true}
							/>
						</div>
						<div className="grid gap-1 py-2">
							<InputLabel
								name="password"
								placeholder="Mot de passe"
								label="Mot de passe"
								required={true}
							/>
						</div>
						<div className="text-center mt-3">
							<Button text="Créer" />
						</div>
					</div>
					{state.error && <span>{state.error}</span>}
				</form>
			</div>
		</MaxWidthWrapper>
	);
}
