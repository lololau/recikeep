import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "recikeep/auth";
import { api } from "recikeep/trpc/server";

export default function SignUpPage() {
	return (
		<form action={signUp}>
			<label htmlFor="email">Email</label>
			<input type="email" name="email" id="email" required />
			<label htmlFor="password">Password</label>
			<input type="password" name="password" id="password" required />
			<button type="submit">Sign up</button>
		</form>
	);
}

async function signUp(formData: FormData) {
	"use server";
	const email = formData.get("email");
	const password = formData.get("password");

	if (email == null || password == null) {
		return { error: "Invalid credentials" };
	}

	const user = await api.auth.signUp({
		email: email.toString(),
		password: password.toString(),
	});

	// new session
	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	return redirect("/profile");
}
