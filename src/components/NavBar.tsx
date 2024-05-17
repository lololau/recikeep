import Link from "next/link";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { PiCookingPotFill } from "react-icons/pi";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "recikeep/auth/auth";
import { Button } from "./Button";

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

export const NavBar = async () => {
	return (
		<div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
			<header className="relative bg-white">
				<MaxWidthWrapper>
					<div className="border-b border-gray-200">
						<div className="flex h-16 items-center">
							{/* { TODO: account } */}
							<div className="ml-4 flex lg:ml-0">
								<Link href="/">
									<PiCookingPotFill className="h-10 w-10" />
								</Link>
							</div>
							<div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch w-full">
								<ul className="relative list-none flex h-full items-center divide-x divide-gray-400 font-light text-gray-600">
									<Link href="/">
										<li className="pr-4 hover:text-gray-800 hover:font-semibold">
											Mes recettes
										</li>
									</Link>
									<Link href="/recipe">
										<li className="px-4 hover:text-gray-800 hover:font-semibold">
											Nouvelle recette
										</li>
									</Link>
									<Link href="/bucket">
										<li className="pl-4 hover:text-gray-800 hover:font-semibold">
											Backlog
										</li>
									</Link>
								</ul>
							</div>
							<div className="text-right w-full">
								<form action={logout}>
									<Button text="Sign out" />
								</form>
							</div>
						</div>
					</div>
				</MaxWidthWrapper>
			</header>
		</div>
	);
};
