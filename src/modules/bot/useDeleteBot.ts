import type { UseMutationConfig } from "@/shared/types/mutationConfig.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/apiClient.ts";
import toast from "@/shared/lib/toast.ts";
import axios from "axios";
import { BOT_BASE_KEY } from "@/modules/bot/index.ts";

export const useDeleteBot = (config?: UseMutationConfig) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiClient.delete({
        url: `/bots/${id}`,
      }),
    ...config,
    onSuccess: (data) => {
      toast.success("Телеграм бот видалений");
      config?.onSuccess?.(data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) toast.error(error.response?.data.message);
      config?.onError?.(error);
    },
    onSettled: async (data, error) => {
      await queryClient.invalidateQueries({
        queryKey: [BOT_BASE_KEY],
      });
      config?.onSettled?.(data, error);
    },
  });

  return { mutate, isPending };
};
