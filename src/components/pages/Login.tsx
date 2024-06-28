"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { PiCookingPotFill } from "react-icons/pi";
import { signIn } from "recikeep/auth/auth_actions";
import { Button } from "recikeep/components/Button";
import { InputLabel } from "recikeep/components/InputLabel";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";

export default function LoginForm() {
	const [state, formAction] = useFormState(signIn, { error: "" });
	return (
		<MaxWidthWrapper>
			<div className="py-20 mx-auto grid gap-3 items-center max-w-md sm:px-0 px-3">
				<PiCookingPotFill className="h-10 w-10 justify-self-center" />
				<h1 className="text-2xl font-semibold text-center">Mon compte</h1>
				<p className="text-center text-sm">
					Tu n'as pas de compte?{" "}
					<Link href="/signup" className="underline">
						Crée-le
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
							<Button text="Se connecter" />
						</div>
					</div>

					{state.error && <span>{state.error}</span>}
				</form>
			</div>
		</MaxWidthWrapper>
	);
}
