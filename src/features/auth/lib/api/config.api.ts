import { createFetchInstance } from "@/shared/utilities/api.utilities";

export function buildAuthApiUrl(path: string, baseUrl?: string) {
  const normalizedBaseUrl = baseUrl?.replace(/\/$/, "") ?? "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}/api/v1/auth${normalizedPath}`;
}

interface CreateAuthApiFetchOptions {
  baseUrl?: string;
  defaultHeaders?: HeadersInit;
  fetchImpl?: typeof globalThis.fetch;
}
export function createAuthApiFetch({
  baseUrl,
  defaultHeaders,
  fetchImpl,
}: CreateAuthApiFetchOptions = {}) {
  const instance = createFetchInstance({
    defaultBaseUrl: baseUrl,
    defaultHeaders,
    fetchImpl,
  });

  return (path: string, init: RequestInit = {}) =>
    instance(buildAuthApiUrl(path), init);
}
