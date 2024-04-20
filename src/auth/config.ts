import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "recikeep/database";
import type { Adapter } from "next-auth/adapters";
import { api } from "recikeep/trpc/server";

export const authConfig = {
	adapter: DrizzleAdapter(db) as Adapter,
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { type: "email" },
				password: { type: "password" },
			},
			async authorize(credentials, req) {
				const user = await api.auth.signIn({
					email: credentials.email as string,
					password: credentials.password as string,
				});
				return { id: user.id, email: user.email };
			},
		}),
	],
	callbacks: {
		session: (opts) => {
			console.log(opts);
			if (!("user" in opts)) throw "ca marche pas";

			return {
				...opts.session,
				user: {
					...opts.session.user,
					id: opts.user.id,
				},
			};
		},
	},
} satisfies NextAuthConfig;
