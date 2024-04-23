"use client";
import { useSession } from "recikeep/components/SessionContext";

export const ClientSideProfile = () => {
	const { session } = useSession();

	if (session == null) {
		<div className="border border-red-500">
			<h4>Client component</h4>
			<p>not logged in</p>
		</div>;
	}

	return (
		<div className="border border-red-500">
			<h4>Client component</h4>
			<p>{JSON.stringify(session, undefined, 2)}</p>
		</div>
	);
};
