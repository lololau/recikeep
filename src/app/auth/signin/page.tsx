import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "recikeep/auth";
import { api } from "recikeep/trpc/server";

export default async function SigninPage() {
	return (
		<div>
			<h2>Sign in</h2>
			<form action={signin} className="gap-y-2">
				<div className="gap-y-1">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						className="text-black"
					/>
				</div>
				<div className="gap-y-1">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						className="text-black"
					/>
				</div>
				<button type="submit">Sign up</button>
			</form>
		</div>
	);
}

interface ActionResult {
	error: string;
}

async function signin(formData: FormData): Promise<ActionResult> {
	"use server";
	const email = formData.get("email");
	const password = formData.get("password");

	if (email === null || password === null) {
		return { error: "Invalid input" };
	}

	try {
		const user = await api.auth.signIn({
			email: email.toString(),
			password: password.toString(),
		});

		const session = await lucia.createSession(user.id, { email: user.email });
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (error) {
		console.error(error);
		return { error: "Invalid credentials" };
	}

	return redirect("/profile");
}
