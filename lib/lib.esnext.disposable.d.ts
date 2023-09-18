interface SuppressedError extends Error {
  error: unknown;
  suppressed: unknown;
}
