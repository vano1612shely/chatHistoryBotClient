import type { UseMutationConfig } from "@/shared/types/mutationConfig.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/apiClient.ts";
import { CHANNELS_BASE_KEY } from "@/modules/channels/index.ts";
import toast from "@/shared/lib/toast.ts";
import axios from "axios";

export const useCreateChannel = (config?: UseMutationConfig) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      name,
      telegramChannelId,
    }: {
      telegramChannelId: string;
      name: string;
    }) =>
      apiClient.post({
        url: "/allowed-channels",
        payload: {
          telegramChannelId,
          name,
        },
      }),
    ...config,
    onSuccess: (data) => {
      toast.success("Канал створено");
      config?.onSuccess?.(data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) toast.error(error.response?.data.message);
      config?.onError?.(error);
    },
    onSettled: async (data, error) => {
      await queryClient.invalidateQueries({
        queryKey: [CHANNELS_BASE_KEY],
      });
      config?.onSettled?.(data, error);
    },
  });

  return { mutate, isPending };
};
