export type UseMutationConfig<TData = any, TError = any> = {
	onError?: (error: TError) => void
	onSuccess?: (data: TData) => void
	onMutate?: (variables: any) => void
	onSettled?: (data: TData | null, error: TError | null) => void
}
