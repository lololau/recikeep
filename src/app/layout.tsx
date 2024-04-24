import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "recikeep/trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Recikeep",
	description: "Keep your recipes safe!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<body
				className={`${inter.className} relative h-full font-sans antialiased bg-gray-800 text-white`}
			>
				<main className="relative flex flex-col min-h-screen">
					<div className="flex-grow flex-1">
						<TRPCReactProvider>{children}</TRPCReactProvider>
					</div>
				</main>
			</body>
		</html>
	);
}
