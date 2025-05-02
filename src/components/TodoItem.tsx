import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/client";
import { Trash2 } from "lucide-react";

interface TodoItemProps {
	todo: RouterOutputs["todos"]["getAll"][number];
	onToggle: (id: number, completed: boolean) => void;
	onDelete: (id: number) => void;
	isTogglePending: boolean;
	isDeletePending: boolean;
}

export function TodoItem({
	todo,
	onToggle,
	onDelete,
	isTogglePending,
	isDeletePending,
}: TodoItemProps) {
	return (
		<li className="group flex items-center justify-between py-2">
			<div className="flex items-center gap-3">
				<Checkbox
					checked={Boolean(todo.completed)}
					onCheckedChange={() => onToggle(todo.id, !todo.completed)}
					disabled={isTogglePending}
					className="rounded-full border-gray-300 data-[state=checked]:bg-gray-800 data-[state=checked]:text-white"
				/>
				<span
					className={cn(
						"text-sm transition-all duration-200",
						todo.completed && "text-gray-400 line-through",
					)}
				>
					{todo.title}
				</span>
			</div>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => onDelete(todo.id)}
				disabled={isDeletePending}
				className="opacity-0 transition-opacity group-hover:opacity-100"
			>
				<Trash2 className="h-3.5 w-3.5 text-gray-400" />
			</Button>
		</li>
	);
}
