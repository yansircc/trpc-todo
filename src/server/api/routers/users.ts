import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const usersRouter = createTRPCRouter({
	getUser: protectedProcedure.query(async ({ ctx }) => {
		return ctx.session.user;
	}),
});
