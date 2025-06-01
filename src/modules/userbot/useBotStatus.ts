import { useQuery } from "@tanstack/react-query";
import { USER_BOT_BASE_KEY } from "@/modules/userbot/index.ts";
import { apiClient } from "@/shared/api/apiClient.ts";
import type { UseQueryConfig } from "@/shared/types/queryConfig.ts";
import { withQueryConfig } from "@/shared/lib/withQueryConfig.ts";

export const useBotStatus = (sessionId: string, config?: UseQueryConfig) => {
  const { enabled, queryKey } = withQueryConfig(config);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [USER_BOT_BASE_KEY, ...queryKey],
    queryFn: () =>
      apiClient.get<{
        awaitingAuth: boolean;
        exists: boolean;
        started: boolean;
        authType: string;
      }>({
        url: `/userbot/${sessionId}/auth-status`,
      }),
    enabled,
  });
  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
