import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";

export const testRouter = createTRPCRouter({
	foo: publicProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.query(({ input, ctx }) => {
			return `Hello ${input.name}! You session ID is ${ctx.session?.user.id}`;
		}),
});
