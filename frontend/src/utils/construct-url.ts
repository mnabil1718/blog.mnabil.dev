import { encodeQueryParams } from "./encode-query-params";

export const constructUrl = (
  endpoint: string,
  params: Record<string, string>
): string => {
  const query = encodeQueryParams(params);

  // Construct the URL without a trailing "?" if there are no parameters
  const url = query ? `${endpoint}?${query}` : endpoint;

  return url;
};
