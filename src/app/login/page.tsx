"use client";
import { useFormState } from "react-dom";
import { signIn } from "recikeep/actions";

export default function LoginPage() {
	const [state, formAction] = useFormState(signIn, { error: "" });
	return (
		<form action={formAction}>
			<p>{JSON.stringify(state, undefined, 2)}</p>
			<label htmlFor="email">Email</label>
			<input type="email" name="email" id="email" required />
			<label htmlFor="password">Password</label>
			<input type="password" name="password" id="password" required />
			<button type="submit">Sign in</button>
		</form>
	);
}
