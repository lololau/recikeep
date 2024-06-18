import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "recikeep/trpc/react";
import { NavBar } from "recikeep/components/NavBar";
import { validateRequest } from "recikeep/auth/auth";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
				className={`${inter.className} relative h-full font-sans antialiased z-10`}
				id="root"
			>
				<main className="relative flex flex-col min-h-screen" id="user">
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
