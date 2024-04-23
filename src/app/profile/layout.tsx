import { validateRequest } from "recikeep/auth";
import { SessionContextProvider } from "recikeep/components/SessionContext";

export default async function ProfileLayout({
	children,
}: { children: React.ReactNode }) {
	const auth = await validateRequest();

	return <SessionContextProvider {...auth}>{children}</SessionContextProvider>;
}
