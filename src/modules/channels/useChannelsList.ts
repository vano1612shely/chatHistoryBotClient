import type { UseQueryConfig } from "@/shared/types/queryConfig.ts";
import { withQueryConfig } from "@/shared/lib/withQueryConfig.ts";
import { useQuery } from "@tanstack/react-query";
import { CHANNELS_BASE_KEY } from "@/modules/channels/index.ts";
import { apiClient } from "@/shared/api/apiClient.ts";
import type { Channel } from "@/modules/channels/types.ts";

export const useChannelsList = (config?: UseQueryConfig) => {
  const { enabled, queryKey } = withQueryConfig(config);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [CHANNELS_BASE_KEY, ...queryKey],
    queryFn: () =>
      apiClient.get<Channel[]>({
        url: "/allowed-channels",
      }),
    enabled,
  });

  return { data, isLoading, error, refetch };
};
