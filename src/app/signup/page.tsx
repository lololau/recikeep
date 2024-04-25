"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { PiCookingPotFill } from "react-icons/pi";
import { signUp } from "recikeep/auth/auth_actions";
import { Button } from "recikeep/components/Button";
import { MaxWidthWrapper } from "recikeep/components/MaxWidthWrapper";

export default function SignUpPage() {
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
							<label htmlFor="email" className="text-lg">
								Email
							</label>
							<div className="rounded-md shadow-sm border-2 sm:max-w-md">
								<input
									type="email"
									name="email"
									id="email"
									required
									className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full"
									placeholder="you@example.com"
								/>
							</div>
						</div>
						<div className="grid gap-1 py-2">
							<label htmlFor="password" className="text-lg">
								Mot de passe
							</label>
							<div className="rounded-md shadow-sm border-2 sm:max-w-md">
								<input
									type="password"
									name="password"
									id="password"
									required
									className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm w-full focus-within:ring-green-700"
									placeholder="Mot de passe"
								/>
							</div>
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
