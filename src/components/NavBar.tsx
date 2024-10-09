import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MdPlaylistAddCircle } from "react-icons/md";
import { PiCookingPotFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { lucia, validateRequest } from "recikeep/auth/auth";
import { Button } from "./Button";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { IoIosAddCircle } from "react-icons/io";

// Function to log out the user and invalidate the session
async function logout() {
	"use server";
	const { session, user } = await validateRequest();
	if (!session || !user) {
		return {
			error: "Unauthorized",
		};
	}

	// Invalidate the user's session to log them out
	await lucia.invalidateSession(session.id);

	// Clear the current session
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);
	return redirect("/login");
}

// Asynchronous NavBar component
export const NavBar = async () => {
	return (
		<div className="sm:sticky z-50 sm:top-0 sm:border-0 inset-x-0 h-16 fixed bottom-0">
			<div className="relative">
				<MaxWidthWrapper>
					{/* Desktop menu */}
					<div className="h-16 items-center hidden sm:flex bg-white">
						<div className="ml-4 sm:ml-0">
							<Link href="/" className="flex items-center gap-1">
								<div className="text-2xl font-gupter font-semibold">
									<p className="">Recikeep.</p>
								</div>
								<PiCookingPotFill className="h-10 w-10 text-rose-200" />
							</Link>
						</div>
						<div className="hidden z-50 sm:ml-8 sm:block sm:self-stretch w-full">
							<ul className="relative list-none flex h-full items-center divide-x divide-gray-400 font-light text-gray-600">
								<Link href="/">
									<li className="pr-3 hover:text-gray-800 hover:font-semibold">
										Mes recettes
									</li>
								</Link>
								<Link href="/recipe">
									<li className="px-3 flex items-center gap-1 text-emerald-800 hover:text-gray-800 font-semibold">
										<IoIosAddCircle />
										<p>Recette</p>
									</li>
								</Link>
								<Link href="/bucket">
									<li className="px-3 hover:text-gray-800 hover:font-semibold">
										Backlog
									</li>
								</Link>
								<Link href="/profil">
									<li className="pl-3 hover:text-gray-800 hover:font-semibold">
										Profil
									</li>
								</Link>
							</ul>
						</div>
						<div className="text-right w-full items-center">
							<form action={logout}>
								<Button text="Déconnexion" />
							</form>
						</div>
					</div>
				</MaxWidthWrapper>
				{/* Mobile menu */}
				<div className="h-16 items-center text-center sm:hidden flex w-full border-t border-emerald-800 rounded-2xl bg-white">
					{/* { TODO: account } */}
					<div className="z-50 w-full">
						<ul className="relative list-none flex justify-around h-full">
							<Link href="/" className="text-3xl">
								<PiCookingPotFill />
							</Link>
							<Link href="/bucket" className="text-3xl">
								<MdPlaylistAddCircle color="#fecaca" />
							</Link>
							<Link href="/profil" className="text-3xl">
								<FaUserCircle />
							</Link>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
