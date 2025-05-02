import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/trpc/server";
import type { Session } from "next-auth";

export async function LoginWidget({ session }: { session: Session }) {
	// 尝试从 TRPC 中获取用户信息，看似多此一举，实则为了测试 TRPC 可以从服务端获取数据的能力
	const user = await api.users.getUserById(session.user.id);

	return (
		<div className="absolute top-4 right-4 flex items-center gap-3">
			<div className="flex flex-col items-end">
				<span className="font-medium text-gray-800 text-sm">{user?.name}</span>
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
	);
}
