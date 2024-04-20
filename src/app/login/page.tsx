"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { api } from "recikeep/trpc/react";

export default function loginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { mutate, isSuccess } = api.auth.signUp.useMutation({
		onSuccess(data, { email, password }, context) {
			signIn("credentials", {
				email,
				password,
			});
		},
	});

	return (
		<div>
			{isSuccess && <p>Vous êtes connectés</p>}
			<form
				onSubmit={(event) => {
					event.preventDefault();
					signIn("credentials", {
						email,
						password,
						redirect: false,
					});
					// mutate({ email, password });
				}}
			>
				<p>Email:</p>
				<input
					type="text"
					name="email"
					required
					id="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
				/>
				<p>Password:</p>
				<input
					type="password"
					name="pwd"
					id="pwd"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				/>
				<button type="submit">LogIn</button>
			</form>
		</div>
	);
}
