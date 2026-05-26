/** User-facing message for unexpected client/network failures. */
export function getClientErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
