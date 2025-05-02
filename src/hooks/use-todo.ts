import { type RouterOutputs, useTRPC } from "@/trpc/client";
import { createOptimisticUpdater } from "@/utils/optimistic-updates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Todo = RouterOutputs["todos"]["getAll"][number];

// 操作类型枚举
type OperationType = "create" | "toggle" | "delete";

// 操作状态接口
interface OperationState {
	type: OperationType;
	itemId: number; // -1 表示新建项没有ID
}

export function useTodoLogic() {
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [pendingOperations, setPendingOperations] = useState<OperationState[]>(
		[],
	);
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	// 添加待处理操作
	const addPendingOperation = (type: OperationType, itemId: number) => {
		setPendingOperations((prev) => [...prev, { type, itemId }]);
	};

	// 移除待处理操作
	const removePendingOperation = (type: OperationType, itemId: number) => {
		setPendingOperations((prev) =>
			prev.filter((op) => !(op.type === type && op.itemId === itemId)),
		);
	};

	// 检查项目是否有特定类型的操作正在进行
	const isOperationPending = (type: OperationType, itemId: number) => {
		return pendingOperations.some(
			(op) => op.type === type && op.itemId === itemId,
		);
	};

	// 创建乐观更新器
	const withOptimisticUpdate = createOptimisticUpdater(queryClient);

	// 主查询 - 使用 todos 路由
	const todosQuery = useQuery(trpc.todos.getAll.queryOptions());

	// 生成 todos 查询键以进行无效化
	const todosQueryKey = trpc.todos.getAll.queryKey();

	// 使用乐观更新创建 Todo
	const createTodo = useMutation({
		mutationFn: trpc.todos.create.mutationOptions().mutationFn,
		...withOptimisticUpdate<{ text: string }, Todo[]>({
			queryKey: todosQueryKey,
			updateFn: (newTodo, oldData = []) => {
				const tempId = Date.now();
				addPendingOperation("create", tempId);
				const now = new Date();
				return [
					{
						id: tempId,
						title: newTodo.text,
						completed: false,
						createdById: "temp-user",
						createdAt: now,
						updatedAt: null,
					},
					...oldData,
				];
			},
			onCancel: () => setNewTodoTitle(""),
		}),
		onSuccess: (_data, _variables) => {
			// 暂时使用 -1 表示创建操作完成
			removePendingOperation("create", -1);
			setNewTodoTitle("");
		},
		onError: () => {
			removePendingOperation("create", -1);
		},
	});

	// 使用乐观更新切换 Todo 完成状态
	const toggleComplete = useMutation({
		mutationFn: trpc.todos.toggle.mutationOptions().mutationFn,
		...withOptimisticUpdate<{ id: number; completed: boolean }, Todo[]>({
			queryKey: todosQueryKey,
			updateFn: (input, oldData = []) => {
				addPendingOperation("toggle", input.id);
				return oldData.map((todo) =>
					todo.id === input.id ? { ...todo, completed: input.completed } : todo,
				);
			},
		}),
		onSuccess: (_data, variables) => {
			removePendingOperation("toggle", variables.id);
		},
		onError: (_error, variables) => {
			removePendingOperation("toggle", variables.id);
		},
	});

	// 使用乐观更新删除 Todo
	const deleteTodo = useMutation({
		mutationFn: trpc.todos.delete.mutationOptions().mutationFn,
		...withOptimisticUpdate<number, Todo[]>({
			queryKey: todosQueryKey,
			updateFn: (id, oldData = []) => {
				addPendingOperation("delete", id);
				return oldData.filter((todo) => todo.id !== id);
			},
		}),
		onSuccess: (_data, id) => {
			removePendingOperation("delete", id);
		},
		onError: (_error, id) => {
			removePendingOperation("delete", id);
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

	// 检查特定项目的操作状态
	const isCreating = createTodo.isPending;
	const isTogglingItem = (id: number) => isOperationPending("toggle", id);
	const isDeletingItem = (id: number) => isOperationPending("delete", id);

	const { data: user } = useQuery(trpc.users.getUser.queryOptions());

	// 返回状态和操作
	return {
		newTodoTitle,
		setNewTodoTitle,
		todosQuery,
		toggleComplete,
		deleteTodo,
		handleCreateTodo,
		handleToggleComplete,
		handleDeleteTodo,
		isCreating,
		isTogglingItem,
		isDeletingItem,
		pendingOperations,
		user,
	};
}
