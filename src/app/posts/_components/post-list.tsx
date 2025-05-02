"use client";

import Link from "next/link";

import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/react";

interface PostListProps {
	initialPosts: RouterOutputs["post"]["getAll"];
}

export function PostList({ initialPosts }: PostListProps) {
	const trpc = api.useContext();

	// 使用 tRPC 的 useQuery 钩子与初始数据
	const { data } = api.post.getAll.useQuery(
		{ limit: 10 },
		{ initialData: initialPosts },
	);

	if (!data || data.items.length === 0) {
		return <div className="py-8 text-center">还没有帖子，创建一个吧！</div>;
	}

	return (
		<ul className="space-y-4">
			{data.items.map((post) => (
				<li
					key={post.id}
					className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
				>
					<Link href={`/post/${post.id}`} className="block p-4">
						<h3 className="font-semibold text-lg">{post.name}</h3>
						<p className="mt-1 text-gray-500 text-sm">
							创建于 {new Date(post.createdAt).toLocaleString()}
						</p>
					</Link>
				</li>
			))}
		</ul>
	);
}
