import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";

export default async function HomePage() {
	const { session } = await validateRequest();
	if (session) {
		return redirect("/home");
	}
	return <></>;
}
