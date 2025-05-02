import { TodoList } from "@/components/TodoList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";
import { Suspense } from "react";

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

	// 确保在服务端完全加载数据
	await api.todos.getAll.prefetch();

	// 尝试从 trpc 中获取用户信息
	const user = await api.users.getUser();

	return (
		<HydrateClient>
			<main className="relative flex min-h-screen flex-col items-center bg-white p-4">
				{/* 用户头像和退出按钮 */}
				<div className="absolute top-4 right-4 flex items-center gap-3">
					<div className="flex flex-col items-end">
						<span className="font-medium text-gray-800 text-sm">
							{user?.name}
						</span>
						<a
							href="/api/auth/signout"
							className="text-gray-500 text-xs transition-colors hover:text-gray-800"
						>
							Sign out
						</a>
					</div>
					<Avatar className="h-10 w-10">
						{user?.image ? (
							<AvatarImage src={user.image} alt={user?.name || "User"} />
						) : (
							<AvatarFallback>
								{user?.name
									?.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase() || "U"}
							</AvatarFallback>
						)}
					</Avatar>
				</div>

				<div className="w-full max-w-md py-12">
					<Suspense
						fallback={
							<div className="flex justify-center py-8">Loading todos...</div>
						}
					>
						<TodoList />
					</Suspense>
				</div>
			</main>
		</HydrateClient>
	);
}
