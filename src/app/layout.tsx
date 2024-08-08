import type { Metadata } from "next";
import { validateRequest } from "recikeep/auth/auth";
import { NavBar } from "recikeep/components/NavBar";
import { TRPCReactProvider } from "recikeep/trpc/react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
	title: "Recikeep",
	description: "Keep your recipes safe!",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { session } = await validateRequest();
	return (
		<html lang="en" className="h-full">
			<body
				className={"font-pt_serif relative h-full antialiased z-10"}
				id="root"
			>
				<main className="relative flex flex-col min-h-screen">
					{session && <NavBar />}
					<div className="flex-grow flex-1 ">
						<TRPCReactProvider>{children}</TRPCReactProvider>
					</div>
				</main>
				<Toaster />
			</body>
		</html>
	);
}
