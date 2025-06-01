import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/apiClient.ts";

export const useMe = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      apiClient.get<{
        userId: number;
        login: string;
        role: string;
      }>({
        url: "/auth/me",
      }),
  });
  return { data, isLoading, error };
};
