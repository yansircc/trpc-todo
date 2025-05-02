import { HydrateClient, api } from "@/trpc/server";
import { TestCard as TestCardClient } from "./test-card";

export default async function TestPage() {
	return (
		<HydrateClient>
			<div className="flex flex-wrap gap-4 p-4">
				<TestCardClient />
			</div>
		</HydrateClient>
	);
}

async function TestCard({ name }: { name: string }) {
	const data = await api.test.foo({ name });
	return (
		<div className="rounded-lg bg-blue-500 p-4 text-white shadow-md">
			{data}
		</div>
	);
}
