import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { todos } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

/**
 * Todos 路由器 - 包含基本的 CRUD 操作
 */
export const todosRouter = createTRPCRouter({
	// 获取所有 todos
	getAll: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.todos.findMany({
			where: eq(todos.createdById, ctx.session.user.id),
			orderBy: [desc(todos.createdAt)],
		});
	}),

	// 获取单个 todo
	getById: protectedProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			const todo = await ctx.db.query.todos.findFirst({
				where: and(
					eq(todos.id, input.id),
					eq(todos.createdById, ctx.session.user.id),
				),
			});
			if (!todo) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}
			return todo;
		}),

	// 创建 todo
	create: protectedProcedure
		.input(z.object({ text: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			return await ctx.db
				.insert(todos)
				.values({
					title: input.text,
					completed: false,
					createdById: userId,
				})
				.returning({ id: todos.id });
		}),

	// 更新 todo
	update: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().min(1).optional(),
				completed: z.boolean().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;

			const updateData: Partial<{ title: string; completed: boolean }> = {};
			if (data.title !== undefined) updateData.title = data.title;
			if (data.completed !== undefined) updateData.completed = data.completed;

			if (Object.keys(updateData).length === 0) {
				return { success: true };
			}

			const result = await ctx.db
				.update(todos)
				.set(updateData)
				.where(
					and(eq(todos.id, id), eq(todos.createdById, ctx.session.user.id)),
				)
				.returning({ id: todos.id });

			if (result.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Todo not found or you don't have permission.",
				});
			}

			return { success: true };
		}),

	// 删除 todo
	delete: protectedProcedure
		.input(z.number())
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const result = await ctx.db
				.delete(todos)
				.where(and(eq(todos.id, input), eq(todos.createdById, userId)))
				.returning({ id: todos.id });

			if (result.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Todo not found or you don't have permission.",
				});
			}
			return { success: true };
		}),

	// 切换 todo 完成状态
	toggle: protectedProcedure
		.input(z.object({ id: z.number(), completed: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const result = await ctx.db
				.update(todos)
				.set({ completed: input.completed })
				.where(and(eq(todos.id, input.id), eq(todos.createdById, userId)))
				.returning({ id: todos.id });

			if (result.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Todo not found or you don't have permission.",
				});
			}
			return { success: true };
		}),
});
