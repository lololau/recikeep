"use server";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "../trpc/server";
import { lucia } from "./auth";

// Function for signing in an existing user with email and password
export async function signIn(_: unknown, formData: FormData) {
	const email = formData.get("email");
	const password = formData.get("password");

	// If either email or password is missing, return an error
	if (email == null || password == null) {
		return { error: "Invalid credentials" };
	}

	try {
		// Authenticate the user using the `api.auth.signIn` method
		const user = await api.auth.signIn({
			email: email.toString(),
			password: password.toString(),
		});

		// Create a new session for the user after successful sign-in
		const session = await lucia.createSession(user.id, {});
		// Create a session cookie to store the session ID for the client
		const sessionCookie = lucia.createSessionCookie(session.id);

		// Set the session cookie in the user's browser
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (error) {
		return { error: "Email ou mot de passe incorrect" };
	}

	// Redirect the user to the home page after a successful login
	return redirect("/home");
}

// Function for signing up a new user with email and password
export async function signUp(_: unknown, formData: FormData) {
	const email = formData.get("email");
	const password = formData.get("password");
	const password_confirmation = formData.get("password_confirmation");
	const pseudo = formData.get("pseudo");
	const isPublic = formData.get("is_public");

	console.log(isPublic, pseudo);
	if (email == null || password == null || pseudo == null || isPublic == null) {
		return { error: "Veuillez remplir tous les champs obligatoires. (*)" };
	}

	if (password !== password_confirmation) {
		return { error: "Les mots de passe ne sont pas identiques." };
	}

	let isPublicBoolean: boolean;
	if (isPublic === "true") {
		isPublicBoolean = true;
	} else {
		isPublicBoolean = false;
	}

	try {
		// Register the new user with the `api.auth.signUp` method
		const user = await api.auth.signUp({
			email: email.toString(),
			password: password.toString(),
			pseudo: pseudo.toString(),
			isPublic: isPublicBoolean,
		});

		// Create a new session for the user after a successful sign-up
		const session = await lucia.createSession(user.id, {});

		// Generate a session cookie with the session ID
		const sessionCookie = lucia.createSessionCookie(session.id);

		// Set the session cookie in the user's browser
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

	// Redirect the user to the home page after a successful signup
	return redirect("/home");
}
