import type { RouterOutputs } from "@/trpc/client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Todo = RouterOutputs["todos"]["getAll"][number];

/**
 * Todo 逻辑钩子 - 使用独立的 todos 路由器
 */
export function useTodoLogic() {
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	// 主查询 - 直接使用 todos 路由器
	const todosQuery = useQuery(trpc.todos.getAll.queryOptions());

	// 生成 todos 查询键，用于后续失效
	const todosQueryKey = trpc.todos.getAll.queryKey();

	// 创建 Todo - 使用独立的 todos 路由器
	const createTodo = useMutation({
		...trpc.todos.create.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: todosQueryKey });
			setNewTodoTitle("");
		},
	});

	// 切换 Todo 完成状态 - 使用独立的 todos 路由器
	const toggleComplete = useMutation({
		...trpc.todos.toggle.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: todosQueryKey });
		},
	});

	// 删除 Todo - 使用独立的 todos 路由器
	const deleteTodo = useMutation({
		...trpc.todos.delete.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: todosQueryKey });
		},
	});

	// 处理创建 Todo
	function handleCreateTodo(e: React.FormEvent) {
		e.preventDefault();
		if (newTodoTitle.trim() === "") return;
		createTodo.mutate({ text: newTodoTitle });
	}

	// 处理切换 Todo 完成状态
	function handleToggleComplete(id: number, completed: boolean) {
		toggleComplete.mutate({ id, completed });
	}

	// 处理删除 Todo
	function handleDeleteTodo(id: number) {
		deleteTodo.mutate(id);
	}

	// 返回状态和操作
	return {
		newTodoTitle,
		setNewTodoTitle,
		todosQuery,
		createTodo,
		toggleComplete,
		deleteTodo,
		handleCreateTodo,
		handleToggleComplete,
		handleDeleteTodo,
	};
}
