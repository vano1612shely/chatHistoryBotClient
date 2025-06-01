import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/apiClient.ts";
import toast from "@/shared/lib/toast.ts";
import type { UseMutationConfig } from "@/shared/types/mutationConfig.ts";
import axios from "axios";
import { USER_BOT_BASE_KEY } from "@/modules/userbot/index.ts";

export const useStart = (config?: UseMutationConfig) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) =>
      apiClient.post({
        url: `/userbot/${id}/start`,
      }),
    ...config,
    onSuccess: (data) => {
      toast.success("Бот запущений");
      config?.onSuccess?.(data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) toast.error(error.response?.data.message);
      config?.onError?.(error);
    },
    onSettled: async (data, error) => {
      await queryClient.invalidateQueries({
        queryKey: [USER_BOT_BASE_KEY],
      });
      config?.onSettled?.(data, error);
    },
  });

  return { mutate, isPending };
};
