import { redirect } from "next/navigation";
import { validateRequest } from "recikeep/auth/auth";
import BucketForm from "recikeep/components/pages/Bucket";
import { api } from "recikeep/trpc/server";

export default async function BucketPage() {
	const { session } = await validateRequest();
	if (session == null) {
		return redirect("/login");
	}

	const buckets = await api.buckets.getBucketsByUserId();

	return <BucketForm buckets={buckets} />;
}
