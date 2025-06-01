import { type UseQueryConfig } from "@/shared/types/queryConfig.ts";

export const withQueryConfig = (
  config?: UseQueryConfig,
): Required<UseQueryConfig> => ({
  enabled: true,
  queryKey: [],
  ...config,
});
