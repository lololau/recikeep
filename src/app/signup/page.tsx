"use client";
import { useFormState } from "react-dom";
import { signUp } from "recikeep/actions";

export default function SignUpPage() {
	const [state, formAction] = useFormState(signUp, { error: "" });
	return (
		<form action={formAction}>
			<label htmlFor="email">Email</label>
			<input type="email" name="email" id="email" required />
			<label htmlFor="password">Password</label>
			<input type="password" name="password" id="password" required />
			<button type="submit">Sign up</button>
		</form>
	);
}
