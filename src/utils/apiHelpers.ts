export function isNetworkOrTimeoutError(error: any): boolean {
  return (
    !error.response ||
    error.code === "ECONNABORTED" ||
    error.message?.toLowerCase().includes("timeout")
  );
}

export function isServerError(error: any): boolean {
  return (
    error.response &&
    (error.response.status >= 500 || error.response.status === 408)
  );
}

export function getRetryDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s delay
  return Math.pow(2, attempt - 1) * 1000;
}
