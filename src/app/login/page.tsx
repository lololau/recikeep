import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "recikeep/auth";
import { api } from "recikeep/trpc/server";

export default function LoginPage() {
	return (
		<form action={signIn}>
			<label htmlFor="email">Email</label>
			<input type="email" name="email" id="email" required />
			<label htmlFor="password">Password</label>
			<input type="password" name="password" id="password" required />
			<button type="submit">Sign in</button>
		</form>
	);
}

async function signIn(formData: FormData) {
	"use server";
	const email = formData.get("email");
	const password = formData.get("password");

	if (email == null || password == null) {
		return { error: "Invalid credentials" };
	}

	try {
		const user = await api.auth.signIn({
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
	} catch (error) {
		return { error: "Invalid credentials" };
	}

	return redirect("/profile");
}
