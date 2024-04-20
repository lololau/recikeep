import { auth, signIn, signOut } from "recikeep/auth";

export default async function ProfilePage() {
	const session = await auth();
	console.log(session);

	if (session) {
		return <p>{JSON.stringify(session, undefined, 2)}</p>;
	}

	return (
		<div>
			<p>Not log in</p>
		</div>
	);
}
