import type { QueryClient } from "@tanstack/react-query";
import type { MutationOptions } from "@tanstack/react-query";

// Generic optimistic update context interface
export interface OptimisticContext<TData> {
	previousData: TData | undefined;
}

// Configuration for optimistic updates
export interface OptimisticUpdateConfig<
	TInput,
	TData = unknown,
	TError = Error,
	TContext = unknown,
> {
	// Query key to target
	queryKey: unknown[];
	// Update function that generates new data based on input and current data
	updateFn: (input: TInput, oldData: TData | undefined) => TData;
	// Optional callback after successful mutation
	onSuccess?: (
		data: unknown,
		variables: TInput,
		context: OptimisticContext<TData> & Partial<TContext>,
	) => void;
	// Optional callback after cancellation
	onCancel?: () => void;
	// Original mutation options (optional)
	mutationOptions?: Partial<
		MutationOptions<
			unknown,
			TError,
			TInput,
			OptimisticContext<TData> & TContext
		>
	>;
}

/**
 * 创建一个乐观更新器
 *
 * @param queryClient - 查询客户端实例
 * @returns 一个生成带有乐观更新选项的突变选项的函数
 */
export function createOptimisticUpdater(queryClient: QueryClient) {
	return function optimisticMutation<
		TInput,
		TData = unknown,
		TError = Error,
		TContext = unknown,
	>(config: OptimisticUpdateConfig<TInput, TData, TError, TContext>) {
		return {
			...config.mutationOptions,
			onMutate: async (input: TInput) => {
				// Cancel any outgoing queries for this query key
				await queryClient.cancelQueries({ queryKey: config.queryKey });

				// Snapshot the previous data for potential rollback
				const previousData = queryClient.getQueryData<TData>(config.queryKey);

				// Apply optimistic update to the cache
				queryClient.setQueryData<TData | undefined>(
					config.queryKey,
					(oldData) => config.updateFn(input, oldData),
				);

				// Execute any additional operations (like clearing input)
				if (config.onCancel) {
					config.onCancel();
				}

				// Return context for potential rollback
				return { previousData } as OptimisticContext<TData> & TContext;
			},
			onError: (
				error: TError,
				input: TInput,
				context: (OptimisticContext<TData> & TContext) | undefined,
			) => {
				// Revert to previous data on error
				if (context?.previousData !== undefined) {
					queryClient.setQueryData(config.queryKey, context.previousData);
				}

				// Call original onError if provided
				if (config.mutationOptions?.onError) {
					config.mutationOptions.onError(error, input, context);
				}
			},
			onSettled: (
				data: unknown,
				error: TError | null,
				input: TInput,
				context: (OptimisticContext<TData> & TContext) | undefined,
			) => {
				// Refresh data after mutation settles
				queryClient.invalidateQueries({ queryKey: config.queryKey });

				// Call original onSettled if provided
				if (config.mutationOptions?.onSettled) {
					config.mutationOptions.onSettled(data, error, input, context);
				}
			},
			onSuccess: (
				data: unknown,
				input: TInput,
				context: (OptimisticContext<TData> & TContext) | undefined,
			) => {
				// Call custom onSuccess if provided
				if (config.onSuccess && context) {
					config.onSuccess(data, input, context);
				}

				// Call original onSuccess if provided
				if (config.mutationOptions?.onSuccess && context) {
					config.mutationOptions.onSuccess(data, input, context);
				}
			},
		};
	};
}
