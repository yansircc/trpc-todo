"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

export function CreatePostForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const trpc = api.useContext();

	// 使用 tRPC 的 useMutation 钩子
	const { mutate, isPending } = api.post.create.useMutation({
		onSuccess: () => {
			setName("");
			toast({
				title: "创建成功",
				description: "新帖子已创建",
			});
			// 刷新帖子列表
			void trpc.post.getAll.invalidate();
		},
		onError: (error) => {
			toast({
				title: "创建失败",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			mutate({ name });
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<Input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="输入帖子标题"
				className="flex-1"
				disabled={isPending}
			/>
			<Button type="submit" disabled={isPending || !name.trim()}>
				{isPending ? "创建中..." : "创建帖子"}
			</Button>
		</form>
	);
}
