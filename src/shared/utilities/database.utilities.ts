export function parseDatabaseErrorMessage(
  error: unknown,
  fallbackMessage = "Request failed",
) {
  return error instanceof Error ? error.message : fallbackMessage;
}
