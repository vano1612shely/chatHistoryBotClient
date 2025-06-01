import type { UseQueryConfig } from "@/shared/types/queryConfig.ts";
import { withQueryConfig } from "@/shared/lib/withQueryConfig.ts";
import { useQuery } from "@tanstack/react-query";
import { BOT_BASE_KEY } from "@/modules/bot/index.ts";
import { apiClient } from "@/shared/api/apiClient.ts";

export const useBot = (config?: UseQueryConfig) => {
  const { enabled, queryKey } = withQueryConfig(config);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [BOT_BASE_KEY, ...queryKey],
    queryFn: () =>
      apiClient.get<{
        data: {
          createdAt: string;
          id: number;
          isActive: boolean;
          name: string;
          token: string;
          updatedAt: string;
          username: string;
        }[];
        success: boolean;
      }>({
        url: "/bots",
      }),
    select: (data) => data.data,
    enabled,
  });

  return { data, isLoading, error, refetch };
};
