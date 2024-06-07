import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import SignUpForm from "recikeep/components/pages/SignUp";

export default async function SignUpPage() {
	const { session } = await validateRequest();
	if (session) {
		return redirect("/home");
	}

	return <SignUpForm />;
}
