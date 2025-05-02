import Link from "next/link";
import { notFound } from "next/navigation";

import { api } from "@/trpc/server";
import { PostActions } from "../_components/post-actions";

interface PostPageProps {
	params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
	const id = Number.parseInt(params.id);

	// 使用 tRPC 服务端调用获取帖子数据
	const post = await api.post.getById({ id });

	if (!post) {
		notFound();
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mb-4">
				<Link href="/posts" className="text-blue-500 hover:underline">
					← 返回帖子列表
				</Link>
			</div>

			<div className="rounded-lg bg-white p-6 shadow-md">
				<h1 className="mb-4 font-bold text-3xl">{post.name}</h1>
				<p className="mb-6 text-gray-600">
					创建于 {new Date(post.createdAt).toLocaleString()}
				</p>

				{/* 客户端组件，用于帖子操作 */}
				<PostActions id={post.id} />
			</div>
		</main>
	);
}
