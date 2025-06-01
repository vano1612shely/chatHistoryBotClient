import type { UseMutationConfig } from "@/shared/types/mutationConfig.ts";
import { useMutation } from "@tanstack/react-query";
import toast from "@/shared/lib/toast.ts";
import axios from "axios";
import { apiClient } from "@/shared/api/apiClient.ts";
export interface SendMessageData {
  botId: number;
  buttonText?: string;
  userTelegramId?: string;
  message: string;
  channelId?: string;
  mediaFile?: string;
  mediaType?: "photo" | "video" | "audio" | "document";
  mediaFilename?: string;
  userIds?: string[];
  isBroadcast: boolean;
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const sendMessage = (data: SendMessageData) => {
  const endpoint = data.isBroadcast
    ? "/bots/send-message-all"
    : "/bots/send-message";

  const payload = data.isBroadcast
    ? {
        botId: data.botId,
        buttonText: data.buttonText || undefined,
        message: data.message,
        channelId: data.channelId,
        mediaFile: data.mediaFile || undefined,
        mediaType: data.mediaType || undefined,
        mediaFilename: data.mediaFilename || undefined,
        userIds: data.userIds?.filter((id) => id.trim()) || undefined,
      }
    : {
        botId: data.botId,
        buttonText: data.buttonText || undefined,
        userTelegramId: data.userTelegramId!,
        message: data.message,
        channelId: data.channelId,
        mediaFile: data.mediaFile || undefined,
        mediaType: data.mediaType || undefined,
        mediaFilename: data.mediaFilename || undefined,
      };

  return apiClient.post({
    url: endpoint,
    payload,
  });
};

export const useSendMessage = (config?: UseMutationConfig) => {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      toast.success("Повідомлення відправлено");
      config?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error))
        toast.error(`Помилка відправки:${error.response?.data.message}`);
    },
  });

  return { mutate, mutateAsync, isPending };
};
