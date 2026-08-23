interface CreateFetchInstanceOptions {
  defaultBaseUrl?: string;
  defaultHeaders?: HeadersInit;
  fetchImpl?: typeof globalThis.fetch;
}

function buildRequestUrl(path: string, defaultBaseUrl?: string) {
  const normalizedBaseUrl = defaultBaseUrl?.replace(/\/$/, "") ?? "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

export function createFetchInstance({
  defaultBaseUrl,
  defaultHeaders,
  fetchImpl,
}: CreateFetchInstanceOptions = {}) {
  return (path: string, init: RequestInit = {}) => {
    const headers = new Headers(defaultHeaders);
    const requestHeaders = new Headers(init.headers);

    for (const [key, value] of requestHeaders.entries()) {
      headers.set(key, value);
    }

    const url = buildRequestUrl(path, defaultBaseUrl);
    const resolvedUrl =
      !defaultBaseUrl && typeof window !== "undefined"
        ? new URL(url, window.location.origin).toString()
        : url;

    const activeFetch = fetchImpl ?? globalThis.fetch;

    return activeFetch(resolvedUrl, {
      ...init,
      headers,
    });
  };
}

export async function parseFetchErrorMessage(
  response: Response,
  fallbackMessage = "Request failed",
) {
  const responseText = await response.text();
  let parsedMessage: string | undefined;

  try {
    const errorData = JSON.parse(responseText) as { message?: string };
    parsedMessage = errorData.message;
  } catch {}

  return parsedMessage || responseText || fallbackMessage;
}

export async function throwIfResponseFailed(response: Response) {
  if (!response.ok) {
    throw new Error(await parseFetchErrorMessage(response));
  }
}
