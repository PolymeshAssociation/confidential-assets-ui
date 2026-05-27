/**
 * Extract a human-readable message from any thrown value.
 *
 * JavaScript allows throwing anything — `Error` instances, plain strings,
 * or arbitrary objects. WASM bindings (wasm-bindgen externref table) commonly
 * throw plain strings, so `err instanceof Error` is false and a naive fallback
 * of `'Unknown error'` loses the real message.
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string' && err.length > 0) return err;
  if (err !== null && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  const str = String(err);
  return str !== '[object Object]' ? str : 'Unknown error';
}
