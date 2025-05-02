"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

/**
 * 此组件展示 tRPC v11 与 TanStack Query 的新集成方式
 */
export function PostWithTanStack() {
	const [loadMore, setLoadMore] = useState(false);
	const router = useRouter();
	const queryClient = useQueryClient();
	const trpcUtils = api.useUtils();

	// 1. 使用 useTRPC 钩子获取 tRPC 代理，这是 v11 的实验特性
	// 注意：useTRPC 在当前版本中可能还不可用，这是示例代码
	// 以下代码展示了未来可能的 API 设计

	/*
  const trpc = api.useTRPC();
  
  // 2. 使用 queryOptions 获取帖子
  const postsQuery = useQuery(
    trpc.post.getAll.queryOptions({
      limit: 5,
    })
  );
  
  // 3. 使用 mutationOptions 创建帖子
  const createMutation = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: () => {
        // 4. 使用 queryKey 来使查询无效
        queryClient.invalidateQueries({
          queryKey: trpc.post.getAll.queryKey(),
        });
      },
    })
  );
  
  // 5. 创建部分查询键来使所有帖子相关查询无效
  const invalidateAllPosts = () => {
    queryClient.invalidateQueries({
      queryKey: trpc.post.pathKey(),
    });
  };
  */

	// 当前使用的是标准的 tRPC React Query 客户端
	const { data, isFetching } = api.post.getAll.useQuery(
		{ limit: loadMore ? 20 : 5 },
		{
			refetchOnWindowFocus: false,
			staleTime: 5000,
		},
	);

	return (
		<div className="mt-10 rounded-lg bg-slate-100 p-6 shadow-sm">
			<h2 className="mb-4 font-bold text-slate-800 text-xl">
				使用 tRPC v11 与 TanStack Query
			</h2>

			<div className="mb-4 rounded bg-white p-4">
				<h3 className="mb-2 font-medium text-slate-700">
					当前 tRPC v11 特性：
				</h3>
				<ul className="list-disc space-y-1 pl-5 text-sm">
					<li>服务器组件中的 tRPC 调用 (api.post.xxx)</li>
					<li>数据预取和 hydration</li>
					<li>客户端组件的 tRPC hooks</li>
					<li>React Query 集成</li>
				</ul>
			</div>

			<div className="mb-4 rounded bg-white p-4">
				<h3 className="mb-2 font-medium text-slate-700">
					将来 TanStack Query 集成将包括：
				</h3>
				<ul className="list-disc space-y-1 pl-5 text-sm">
					<li>
						<code>useTRPC()</code> 钩子获取类型安全的 TanStack Query 工厂
					</li>
					<li>
						<code>trpc.xxx.queryOptions()</code> 创建查询选项
					</li>
					<li>
						<code>trpc.xxx.mutationOptions()</code> 创建变更选项
					</li>
					<li>
						<code>trpc.xxx.queryKey()</code> 获取类型安全的查询键
					</li>
					<li>
						<code>trpc.xxx.queryFilter()</code> 创建查询过滤器
					</li>
				</ul>
			</div>

			<div className="mb-4">
				<Button
					onClick={() => setLoadMore(!loadMore)}
					className="mr-2"
					disabled={isFetching}
				>
					{loadMore ? "减少数量" : "加载更多"}
				</Button>

				<Button
					onClick={() => trpcUtils.post.getAll.invalidate()}
					variant="outline"
					disabled={isFetching}
				>
					刷新数据
				</Button>
			</div>

			<div className="text-slate-500 text-sm">
				加载数量: {data?.items.length || 0} 条
			</div>
		</div>
	);
}
