import { TodoList } from "@/components/TodoList";
import { auth } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";

export default async function TodosPage() {
	const session = await auth();

	if (!session?.user) {
		return (
			<main className="flex min-h-screen flex-col items-center justify-center bg-white">
				<div className="py-8">
					<h1 className="mb-2 font-light text-xl tracking-tight">Todo List</h1>
					<p className="mb-6 text-gray-500 text-sm">
						Please sign in to access your todos
					</p>
					<a
						href="/api/auth/signin"
						className="text-gray-800 text-sm transition-colors hover:text-black"
					>
						Sign in
					</a>
				</div>
			</main>
		);
	}

	void api.todos.getAll.prefetch();

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
				<div className="w-full max-w-md py-12">
					<TodoList />
				</div>
			</main>
		</HydrateClient>
	);
}
