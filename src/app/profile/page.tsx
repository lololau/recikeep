import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "recikeep/auth";
import { ClientSideProfile } from "recikeep/components/ClientSideProfile";

export default async function ProfilePage() {
	const { session } = await validateRequest();
	console.log(session);

	if (session) {
		return (
			<div className="border border-blue-500">
				<h4>Server component</h4>
				<p>{JSON.stringify(session, undefined, 2)}</p>
				<form action={logout}>
					<button type="submit">Log out</button>
				</form>

				<ClientSideProfile />
			</div>
		);
	}

	return (
		<div>
			<p>Not log in</p>
		</div>
	);
}

async function logout() {
	"use server";
	const { session } = await validateRequest();
	if (!session) {
		return { error: "Not logged in" };
	}

	await lucia.invalidateSession(session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);
	return redirect("/auth/signin");
}
