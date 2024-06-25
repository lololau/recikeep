"use server";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "../trpc/server";
import { lucia } from "./auth";

export async function signIn(_: unknown, formData: FormData) {
	const email = formData.get("email");
	const password = formData.get("password");

	if (email == null || password == null) {
		return { error: "Invalid credentials" };
	}

	try {
		const user = await api.auth.signIn({
			email: email.toString(),
			password: password.toString(),
		});

		// new session
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (error) {
		console.log(error);
		return { error: "Email or password incorrect" };
	}

	return redirect("/home");
}

export async function signUp(_: unknown, formData: FormData) {
	const email = formData.get("email");
	const password = formData.get("password");

	if (email == null || password == null) {
		return { error: "Invalid credentials" };
	}

	try {
		const user = await api.auth.signUp({
			email: email.toString(),
			password: password.toString(),
		});
		// new session
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (error) {
		console.log("========= ERROR =======", error);
		if (error instanceof TRPCError) return { error: error.message };
		return { error: "Unknown error" };
	}
	return redirect("/home");
}
