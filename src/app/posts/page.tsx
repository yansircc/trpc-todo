import Link from "next/link";

import { api } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { CreatePostForm } from "./_components/create-post-form";
import { PostList } from "./_components/post-list";
import { PostWithTanStack } from "./_components/post-with-tanstack";

export default async function PostsPage() {
	// 在服务器组件中使用 tRPC
	const posts = await api.post.getAll({ limit: 10 });

	return (
		<HydrateClient>
			<main className="container mx-auto px-4 py-8">
				<h1 className="mb-6 font-bold text-3xl">帖子列表</h1>

				<div className="mb-6 flex items-center justify-between">
					<Link href="/" className="text-blue-500 hover:underline">
						返回首页
					</Link>
				</div>

				<div className="mb-8">
					<h2 className="mb-4 font-semibold text-xl">创建新帖子</h2>
					<CreatePostForm />
				</div>

				<div className="mb-8">
					<h2 className="mb-4 font-semibold text-xl">所有帖子</h2>
					<PostList initialPosts={posts} />
				</div>

				<PostWithTanStack />
			</main>
		</HydrateClient>
	);
}
