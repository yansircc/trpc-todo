import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { and, eq, lt } from "drizzle-orm";

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db
				.insert(posts)
				.values({
					name: input.name,
					createdById: ctx.session.user.id,
				})
				.returning({ id: posts.id });

			return result[0];
		}),

	getLatest: protectedProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.query.posts.findFirst({
			orderBy: (posts, { desc }) => [desc(posts.createdAt)],
		});

		return post ?? null;
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),

	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ ctx, input }) => {
			const post = await ctx.db.query.posts.findFirst({
				where: eq(posts.id, input.id),
			});

			return post;
		}),

	getAll: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).default(10),
				cursor: z.number().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { limit, cursor } = input;

			const items = await ctx.db.query.posts.findMany({
				orderBy: (posts, { desc }) => [desc(posts.createdAt)],
				limit: limit + 1,
				...(cursor ? { where: (posts) => lt(posts.id, cursor) } : {}),
			});

			let nextCursor: typeof cursor | undefined = undefined;
			if (items.length > limit) {
				const nextItem = items.pop();
				nextCursor = nextItem?.id;
			}

			return {
				items,
				nextCursor,
			};
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				name: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(posts)
				.set({ name: input.name })
				.where(eq(posts.id, input.id));

			return { success: true };
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(posts).where(eq(posts.id, input.id));

			return { success: true };
		}),
});
