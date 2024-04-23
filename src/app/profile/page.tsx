import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia, validateRequest } from "recikeep/auth";

async function logout() {
	"use server";
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized",
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);
	return redirect("/login");
}

export default async function ProfilePage() {
	const { session } = await validateRequest();
	if (session) {
		return (
			<div>
				<p>Session: {JSON.stringify(session, undefined, 2)}</p>
				<form action={logout}>
					<button type="submit">Sign out</button>
				</form>
			</div>
		);
	}
	return (
		<div>
			<p>Not log in</p>
		</div>
	);
}
