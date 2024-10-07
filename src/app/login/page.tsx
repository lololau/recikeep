import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import LoginForm from "recikeep/components/pages/Login";

export default async function LoginPage() {
	const { session } = await validateRequest();
	if (session) {
		console.log("redirect home");
		return redirect("/home");
	}

	return <LoginForm />;
}
