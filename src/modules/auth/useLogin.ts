import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/apiClient.ts";
import { useAuthStore } from "@/store/auth.store.ts";
import type { UseMutationConfig } from "@/shared/types/mutationConfig.ts";
import toast from "@/shared/lib/toast.ts";
import axios from "axios";

export const useLogin = (config?: UseMutationConfig) => {
  const login = useAuthStore((state) => state.login);
  const { mutate, isPending } = useMutation({
    mutationFn: ({ login, password }: { login: string; password: string }) =>
      apiClient.post({
        url: "/auth/login",
        payload: {
          login,
          password,
        },
      }),
    ...config,
    onSuccess: (data) => {
      if (data.token) {
        login(data.token);
      }
      toast.success("Вхід виконано успішно");
      config?.onSuccess?.(data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) toast.error(error.response?.data.message);
    },
  });

  return { mutate, isPending };
};
