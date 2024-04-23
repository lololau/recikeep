"use client";
import type { Session, User } from "lucia";
import { createContext, useContext } from "react";

type SessionContextState = {
	user: User | null;
	session: Session | null;
};

const SessionContext = createContext<SessionContextState>({
	user: null,
	session: null,
});

type SessionContextProviderProps = {
	children: React.ReactNode;
} & SessionContextState;
export const SessionContextProvider = ({
	children,
	...data
}: SessionContextProviderProps) => {
	return (
		<SessionContext.Provider value={data}>{children}</SessionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);
	if (context == null) {
		throw new Error("useSession must be used within a SessionContextProvider");
	}
	return context;
};
