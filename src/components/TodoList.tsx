"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodoLogic } from "@/hooks/use-todo";
import { Loader2, Plus } from "lucide-react";
import { TodoItem } from "./TodoItem";

export function TodoList() {
	const {
		newTodoTitle,
		setNewTodoTitle,
		todosQuery,
		handleCreateTodo,
		handleToggleComplete,
		handleDeleteTodo,
		isCreating,
		isTogglingItem,
		isDeletingItem,
		user,
	} = useTodoLogic();

	const { data: todos = [], isLoading, isError } = todosQuery;

	return (
		<div className="w-full max-w-md">
			<h2 className="mb-8 font-light text-2xl tracking-tight">Todos</h2>

			<form onSubmit={handleCreateTodo} className="mb-8 flex gap-2">
				<Input
					type="text"
					value={newTodoTitle}
					onChange={(e) => setNewTodoTitle(e.target.value)}
					placeholder="Add a new task..."
					className="flex-1 rounded-none border-0 border-gray-200 border-b px-0 shadow-none focus-visible:border-black focus-visible:ring-0"
					disabled={isCreating}
				/>
				<Button
					type="submit"
					variant="ghost"
					size="sm"
					disabled={isCreating || newTodoTitle.trim() === ""}
					className="px-2"
				>
					{isCreating ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Plus className="h-4 w-4" />
					)}
				</Button>
			</form>

			{isLoading ? (
				<div className="flex justify-center py-8">
					<Loader2 className="h-5 w-5 animate-spin text-gray-400" />
				</div>
			) : isError ? (
				<div className="py-4 text-red-400 text-sm">Error loading todos</div>
			) : (
				<ul className="pt-2">
					{todos.length === 0 ? (
						<p className="py-8 text-center text-gray-400 text-sm">
							No todos yet.
						</p>
					) : (
						todos.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								onToggle={handleToggleComplete}
								onDelete={handleDeleteTodo}
								isTogglePending={isTogglingItem(todo.id)}
								isDeletePending={isDeletingItem(todo.id)}
							/>
						))
					)}
				</ul>
			)}
		</div>
	);
}
