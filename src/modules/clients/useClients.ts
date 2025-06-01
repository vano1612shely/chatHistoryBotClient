import type { UseQueryConfig } from "@/shared/types/queryConfig.ts";
import { withQueryConfig } from "@/shared/lib/withQueryConfig.ts";
import { useQuery } from "@tanstack/react-query";
import { CLIENTS_BASE_KEY } from "@/modules/clients/index.ts";
import { apiClient } from "@/shared/api/apiClient.ts";

export const useClients = (config?: UseQueryConfig) => {
  const { enabled, queryKey } = withQueryConfig(config);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [CLIENTS_BASE_KEY, ...queryKey],
    queryFn: () =>
      apiClient.get<{
        success: boolean;
        data: {
          botId: string;
          createdAt: string;
          firstName: string;
          id: number;
          lastName: string;
          name: string;
          telegramId: string;
          updatedAt: string;
          username: string;
        }[];
      }>({
        url: "/client",
      }),
    enabled,
    select: (data) => data.data,
  });

  return { data, isLoading, refetch, error };
};
