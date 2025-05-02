"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

interface PostActionsProps {
	id: number;
}

export function PostActions({ id }: PostActionsProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	// 使用 tRPC v11 的 TanStack Query 集成获取帖子数据
	const trpc = api.useTRPC();

	// 使用 queryOptions 获取帖子数据
	const postQuery = useQuery({
		...trpc.post.getById.queryOptions({ id }),
	});

	// 使用 mutationOptions 更新帖子
	const updateMutation = useMutation({
		...trpc.post.update.mutationOptions({
			onSuccess: () => {
				// 使用 queryKey 来失效相关查询
				queryClient.invalidateQueries({
					queryKey: trpc.post.getById.queryKey(),
				});
				toast({
					title: "更新成功",
					description: "帖子已被更新",
				});
				setIsEditing(false);
			},
			onError: (error: Error) => {
				toast({
					title: "更新失败",
					description: error.message,
					variant: "destructive",
				});
			},
		}),
	});

	// 使用 mutationOptions 删除帖子
	const deleteMutation = useMutation({
		...trpc.post.delete.mutationOptions({
			onSuccess: () => {
				toast({
					title: "删除成功",
					description: "帖子已被删除",
				});
				router.push("/posts");
			},
			onError: (error: Error) => {
				toast({
					title: "删除失败",
					description: error.message,
					variant: "destructive",
				});
			},
		}),
	});

	const handleStartEdit = () => {
		if (postQuery.data) {
			setName(postQuery.data.name || "");
			setIsEditing(true);
		}
	};

	const handleUpdate = () => {
		updateMutation.mutate({ id, name });
	};

	const handleDelete = () => {
		if (confirm("确定要删除这个帖子吗？")) {
			deleteMutation.mutate({ id });
		}
	};

	if (postQuery.isLoading) {
		return <div>加载中...</div>;
	}

	if (postQuery.isError) {
		return <div>错误: {postQuery.error.message}</div>;
	}

	return (
		<div className="space-y-4">
			{isEditing ? (
				<div className="flex gap-2">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="flex-1"
					/>
					<Button onClick={handleUpdate} disabled={updateMutation.isPending}>
						{updateMutation.isPending ? "保存中..." : "保存"}
					</Button>
					<Button variant="outline" onClick={() => setIsEditing(false)}>
						取消
					</Button>
				</div>
			) : (
				<div className="flex gap-2">
					<Button onClick={handleStartEdit}>编辑</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending ? "删除中..." : "删除"}
					</Button>
				</div>
			)}
		</div>
	);
}
