import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
	getUser: protectedProcedure.query(async ({ ctx }) => {
		return ctx.session.user;
	}),
	getUserById: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			return ctx.db.query.users.findFirst({
				where: eq(users.id, input),
			});
		}),
});
