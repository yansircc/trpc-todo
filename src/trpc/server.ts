import "server-only";

import {
	QueryClient,
	defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import SuperJSON from "superjson";

import { type AppRouter, createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
	const heads = new Headers(await headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		headers: heads,
	});
});

/**
 * Create a QueryClient that can be used on the server
 */
export const getQueryClient = cache(
	() =>
		new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 30 * 1000,
					refetchOnWindowFocus: false,
				},
				dehydrate: {
					serializeData: SuperJSON.serialize,
					shouldDehydrateQuery: (query) =>
						defaultShouldDehydrateQuery(query) ||
						query.state.status === "pending",
				},
				hydrate: {
					deserializeData: SuperJSON.deserialize,
				},
			},
		}),
);

/**
 * Create a caller for use in RSC contexts
 */
const caller = createCaller(createContext);

/**
 * Export the hydration helpers for RSC
 */
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
	caller,
	getQueryClient,
);
